import { DataAPIClient } from "@datastax/astra-db-ts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs/promises";
import path from "path";
import "dotenv/config";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

type SimilarityMetric = "cosine" | "dot_product" | "euclidean";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GEMINI_API_KEY,
} = process.env;

if (
  !ASTRA_DB_NAMESPACE ||
  !ASTRA_DB_COLLECTION ||
  !ASTRA_DB_API_ENDPOINT ||
  !ASTRA_DB_APPLICATION_TOKEN ||
  !GEMINI_API_KEY
) {
  throw new Error("❌ Missing required environment variables");
}

const ai = createGoogleGenerativeAI({ apiKey: GEMINI_API_KEY });

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, {
  keyspace: ASTRA_DB_NAMESPACE,
});

const b10Data = [path.join(process.cwd(), "ben10-knowledge.txt")];

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 150,
});

const createCollectionIfNotExists = async (
  similarityMetric: SimilarityMetric = "cosine"
) => {
  try {
    await db.createCollection(ASTRA_DB_COLLECTION, {
      vector: {
        dimension: 768,
        metric: similarityMetric,
      },
    });

    console.log("✅ Collection created with 768 dimensions");
  } catch (err: any) {
    if (err?.message?.includes("already exists")) {
      console.log("ℹ️ Collection already exists, skipping creation");
    } else {
      throw err;
    }
  }
};

const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION);

  const embeddingModel = ai.textEmbeddingModel("text-embedding-004");

  for (const filePath of b10Data) {
    const content = await fs.readFile(filePath, "utf-8");
    const chunks = await splitter.splitText(content);

    console.log(`📄 Processing ${path.basename(filePath)} - ${chunks.length} chunks`);

    for (const chunk of chunks) {
      if (!chunk || chunk.trim().length < 20) continue;

      const retrievalQuery = `
                ${chunk}

                Include aliens that have abilities such as:
                - flight
                - flying
                - aerial movement
                - airborne travel
                - wings
                `;

const { embeddings } = await embeddingModel.doEmbed({
  values: [retrievalQuery]
});

      const vector = embeddings[0];

      if (!vector || vector.length !== 768) {
        console.warn(`⚠️ Skipping chunk: invalid vector length ${vector?.length}`);
        continue;
      }

      await collection.insertOne({
        $vector: vector,
        text: chunk,
        source: path.basename(filePath),
      });
    }
  }

  console.log("✅ Data ingestion completed");
};

(async () => {
  await createCollectionIfNotExists();
  await loadSampleData();
})();