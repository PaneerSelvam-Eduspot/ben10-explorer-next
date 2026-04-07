import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GEMINI_API_KEY,
} = process.env;

// ── In-memory rate limiter ─────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const WINDOW_MS  = 60_000;

function isRateLimited(userId: string): boolean {
  const now   = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// ── POST ───────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {

    // 1️⃣ Auth guard
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Rate limit
    if (isRateLimited(session.user.id)) {
      return Response.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    // 3️⃣ Validate input
    const { question } = await req.json();
    if (!question || typeof question !== "string" || !question.trim()) {
      return Response.json({ error: "No question provided" }, { status: 400 });
    }

    // 4️⃣ Embed question
    // ✅ gemini-embedding-001 — text-embedding-004 was shut down by Google on Jan 14 2026
    // ✅ Using @google/generative-ai which is consistent with the rest of this file
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

    const embeddingModel = genAI.getGenerativeModel({
      model: "gemini-embedding-001",
    });

    const embeddingRes = await embeddingModel.embedContent(question);
    const vector = embeddingRes.embedding.values;

    // 5️⃣ Vector search AstraDB
    const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
    const db = client.db(ASTRA_DB_API_ENDPOINT!, { keyspace: ASTRA_DB_NAMESPACE! });
    const collection = await db.collection(ASTRA_DB_COLLECTION!);

    const docs = await collection
      .find(null, { sort: { $vector: vector }, limit: 6 })
      .toArray();

    const docContext = docs.map((d) => d.text).join("\n\n");

    // 6️⃣ Generate answer
    const chatModel = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview", 
    });

    const result = await chatModel.generateContent({
      systemInstruction: `
        You are a Ben 10 Encyclopedia and fan guide.

        RULES:
        - Use ONLY the provided information.
        - Do NOT invent details.
        - No meta explanations.
        - No emojis.
        - If the user asks about the character name in ben10 provide the details (eg: ben10 or ben tennyson)
        - Remind your previous response if user ask about the same thing or related to that answer accordingly.
        - If a user ask about anything not related to Ben 10, politely inform them that you can only answer questions about Ben 10.
        - Only if user greets, greet them back and ask how can i help you or similar(don't repeat unnecessarily)
        - Provide the details or list of aliens if user ask like top 5 aliens based on series or according to thier specific abilities, powers etc.,
        - If user try to ask about something but a mistake comes up, then if they answer to your question as yes or something similar, then provide the details.

        FORMAT:
        - ALIEN NAMES.
        - Bullet points for abilities.

        IDENTITY RULE:
        - You are NOT an AI model.
        - You must NEVER say you are Gemini, Google, or a language model.
        - If user ask your name, respond ONLY as: "My name is Assist10."
        - If asked "Who are you?", respond ONLY as: "I am a Ben 10 fan."

        ---
        ${docContext}
        ---
      `,
      contents: [{ role: "user", parts: [{ text: question }] }],
    });

    return Response.json({ answer: result.response.text() });

  } catch (err: any) {
    if (err?.status === 429) {
      return Response.json(
        { error: "Rate limit exceeded. Please wait and try again." },
        { status: 429 }
      );
    }
    console.error("[chat/route]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
