import { DataAPIClient } from "@datastax/astra-db-ts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";
import "dotenv/config";

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

// ✅ gemini-embedding-001 — text-embedding-004 was shut down by Google on Jan 14 2026
// ✅ Switched to @google/generative-ai to match chat/route.ts (one SDK for everything)
// ⚠️  gemini-embedding-001 outputs 3072 dimensions — your OLD collection was 768.
//    You MUST delete the old AstraDB collection and re-run this script.
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { keyspace: ASTRA_DB_NAMESPACE });

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
        dimension: 3072, // ✅ gemini-embedding-001 default output dimension (was 768)
        metric: similarityMetric,
      },
    });
    console.log("✅ Collection created with 3072 dimensions");
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

  for (const filePath of b10Data) {
    const content = await fs.readFile(filePath, "utf-8");
    const chunks = await splitter.splitText(content);

    console.log(`📄 Processing ${path.basename(filePath)} — ${chunks.length} chunks`);

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

      const embeddingRes = await embeddingModel.embedContent(retrievalQuery);
      const vector = embeddingRes.embedding.values;

      if (!vector || vector.length !== 3072) {
        console.warn(`⚠️ Skipping chunk: unexpected vector length ${vector?.length}`);
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