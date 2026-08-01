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

// ── Gemini embedding client ───────────────────────────────────────────────────
// gemini-embedding-001 outputs 3072 dimensions.
// If you are upgrading from an old collection (text-embedding-004 = 768 dims),
// you MUST delete the old AstraDB collection and re-run this script.
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({
  model: "gemini-embedding-001",
});

// ── AstraDB client ────────────────────────────────────────────────────────────
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { keyspace: ASTRA_DB_NAMESPACE });

// ── Source files ──────────────────────────────────────────────────────────────
const b10Data = [path.join(process.cwd(), "ben10-knowledge.txt")];

// ── Text splitter ─────────────────────────────────────────────────────────────
// chunkSize 512 / overlap 150 — balanced for RAG retrieval quality
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 150,
});

// ── Create collection ─────────────────────────────────────────────────────────
const createCollectionIfNotExists = async (
  similarityMetric: SimilarityMetric = "cosine"
) => {
  try {
    await db.createCollection(ASTRA_DB_COLLECTION, {
      vector: {
        dimension: 3072, // gemini-embedding-001 output dimension
        metric: similarityMetric,
      },
    });
    console.log("✅ Collection created with 3072 dimensions");
  } catch (err: any) {
    if (err?.message?.includes("already exists")) {
      console.log("ℹ️  Collection already exists — skipping creation");
    } else {
      throw err;
    }
  }
};

// ── Ingest data ───────────────────────────────────────────────────────────────
const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION);

  for (const filePath of b10Data) {
    const content = await fs.readFile(filePath, "utf-8");
    const chunks = await splitter.splitText(content);

    console.log(
      `📄 Processing ${path.basename(filePath)} — ${chunks.length} chunks`
    );

    for (const chunk of chunks) {
      // Skip chunks that are too short to be meaningful
      if (!chunk || chunk.trim().length < 20) continue;

      // ✅ Embed the raw chunk text — no query augmentation at ingestion time.
      //
      // Previously this appended flight/wings keywords to EVERY chunk before
      // embedding — even chunks about Diamondhead or Wildmutt. That skews the
      // entire embedding space toward aerial abilities regardless of content.
      //
      // Query augmentation belongs at RETRIEVAL time (in route.ts) if needed,
      // not here. Ingestion embeddings should represent what the chunk actually
      // says — nothing more.
      const embeddingRes = await embeddingModel.embedContent(chunk);
      const vector = embeddingRes.embedding.values;

      if (!vector || vector.length !== 3072) {
        console.warn(
          `⚠️  Skipping chunk — unexpected vector length ${vector?.length}`
        );
        continue;
      }

      await collection.insertOne({
        $vector: vector,
        text: chunk,
        source: path.basename(filePath),
      });
    }

    console.log(`✅ Finished ingesting ${path.basename(filePath)}`);
  }

  console.log("✅ Data ingestion completed");
};

// ── Run ───────────────────────────────────────────────────────────────────────
(async () => {
  await createCollectionIfNotExists();
  await loadSampleData();
})();