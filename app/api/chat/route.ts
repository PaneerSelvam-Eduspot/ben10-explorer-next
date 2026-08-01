import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GEMINI_API_KEY,
} = process.env;

// ── Singleton AstraDB client ──────────────────────────────────────────────────
// Initialized once on cold start — reused across all requests.
// Same pattern as lib/prisma.ts — no new TCP connection per request.
const astraClient = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
const db = astraClient.db(ASTRA_DB_API_ENDPOINT!, {
  keyspace: ASTRA_DB_NAMESPACE!,
});

// ── Singleton Gemini clients ──────────────────────────────────────────────────
// @google/generative-ai — embeddings only (no AI SDK equivalent yet)
// @ai-sdk/google        — generation via streamText
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
const embeddingModel = genAI.getGenerativeModel({
  model: "gemini-embedding-001",
});

const google = createGoogleGenerativeAI({
  apiKey: GEMINI_API_KEY!,
});

// ── In-memory rate limiter ────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// ── Types ─────────────────────────────────────────────────────────────────────
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

// ── History helper ────────────────────────────────────────────────────────────
// Called inside onFinish — after full stream is delivered to client.
// Failure is logged but never re-thrown — a DB write error must never
// crash the chat response the user already received.
async function saveHistory(userId: string, messages: ChatMessage[]) {
  try {
    await prisma.chatHistory.upsert({
      where: { userId },
      update: {
        messages: JSON.stringify(messages),
        updatedAt: new Date(),
      },
      create: {
        userId,
        messages: JSON.stringify(messages),
      },
    });
  } catch (err) {
    console.error("[chat/route] saveHistory failed:", err);
  }
}

// ── POST ──────────────────────────────────────────────────────────────────────
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
    const body = await req.json();
    const { question, history } = body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return Response.json({ error: "No question provided" }, { status: 400 });
    }

    // Validate history — filter out any malformed entries defensively
    const safeHistory: ChatMessage[] = Array.isArray(history)
      ? history.filter(
          (m): m is ChatMessage =>
            typeof m === "object" &&
            m !== null &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string"
        )
      : [];

    // 4️⃣ Embed question — singleton embeddingModel
    const embeddingRes = await embeddingModel.embedContent(question);
    const vector = embeddingRes.embedding.values;

    // 5️⃣ Vector search AstraDB — singleton db
    const collection = await db.collection(ASTRA_DB_COLLECTION!);
    const docs = await collection
      .find(null, { sort: { $vector: vector }, limit: 6 })
      .toArray();

    const docContext = docs.map((d) => d.text).join("\n\n");

    // 6️⃣ Build conversation history for AI SDK
    // Cap at last 10 messages (~5 turns) to stay within token budget
    // AI SDK uses "user" | "assistant" natively — no "model" mapping needed
    const MAX_HISTORY = 10;
    const conversationHistory = safeHistory
      .slice(-MAX_HISTORY)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    // 7️⃣ Build new user message — constructed here so onFinish can reference it
    // without re-reading the already-consumed request body
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newUserMessage: ChatMessage = {
      role: "user",
      content: question,
      timestamp,
    };

    // Capture userId for use inside onFinish closure
    const userId = session.user.id;

    // 8️⃣ Stream response
    // onFinish fires AFTER full response is streamed to client —
    // saves complete history atomically with no race condition
    const result = streamText({
      model: google("gemini-3-flash-preview"),
      system: `
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
        - Provide the details or list of aliens if user ask like top 5 aliens based on series or according to their specific abilities, powers etc.,
        - If user try to ask about something but a mistake comes up, then if they answer to your question as yes or something similar, then provide the details.

        FORMAT:
        - ALIEN NAMES in caps.
        - Bullet points for abilities.

        IDENTITY RULE:
        - You are NOT an AI model.
        - You must NEVER say you are Gemini, Google, or a language model.
        - If user asks your name, respond ONLY as: "My name is Assist10."
        - If asked "Who are you?", respond ONLY as: "I am a Ben 10 fan."

        ---
        ${docContext}
        ---
      `,
      messages: [
        ...conversationHistory,
        { role: "user", content: question },
      ],

      // Runs after the complete response has been streamed to the client.
      // `text` = full assembled assistant reply as a single string.
      // Saves: all prior history + new user message + new assistant message.
      onFinish: async ({ text }) => {
        const newAssistantMessage: ChatMessage = {
          role: "assistant",
          content: text,
          timestamp,
        };

        const updatedHistory: ChatMessage[] = [
          ...safeHistory,
          newUserMessage,
          newAssistantMessage,
        ];

        await saveHistory(userId, updatedHistory);
      },
    });

    return result.toTextStreamResponse();

  } catch (err: any) {
  if (err?.status === 429) {
    return Response.json(
      { error: "Rate limit exceeded. Please wait and try again." },
      { status: 429 }
    );
  }
  // 👇 Add this temporarily to see the EXACT error
  console.error("[chat/route] FULL ERROR:", JSON.stringify(err, null, 2));
  console.error("[chat/route] MESSAGE:", err?.message);
  console.error("[chat/route] STACK:", err?.stack);
  return Response.json({ error: "Internal server error" }, { status: 500 });
}
}