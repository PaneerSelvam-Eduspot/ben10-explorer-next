import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GEMINI_API_KEY,
} = process.env;

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return Response.json({ error: "No question provided" }, { status: 400 });
    }

    // Init Gemini INSIDE handler (prevents quota spikes in dev)
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

    const embeddingModel = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });

    const chatModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    /* 1️⃣ Embed question */
    const embeddingRes = await embeddingModel.embedContent(question);
    const vector = embeddingRes.embedding.values;

    /* 2️⃣ Vector search */
    const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
    const db = client.db(ASTRA_DB_API_ENDPOINT!, {
      keyspace: ASTRA_DB_NAMESPACE!,
    });

    const collection = await db.collection(ASTRA_DB_COLLECTION!);
    const docs = await collection
      .find(null, { sort: { $vector: vector }, limit: 6 })
      .toArray();

    const docContext = docs.map((d) => d.text).join("\n\n");

    /* 3️⃣ System Prompt */
    const systemPrompt = `
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
              -  ALIEN NAMES.
              - Bullet points for abilities.

              IDENTITY RULE:
              - You are NOT an AI model.
              - You must NEVER say you are Gemini, Google, or a language model.
              - If user ask your name, respond ONLY as:
                "My name is Assist10."
              - If asked "Who are you?", respond ONLY as:
                "I am a Ben 10 fan."

              ---
              ${docContext}
              ---
              `;

    /* 4️⃣ Generate answer */
    const result = await chatModel.generateContent({
      systemInstruction: systemPrompt,
      contents: [
        {
          role: "user",
          parts: [{ text: question }],
        },
      ],
    });

    const answer = result.response.text();

    return Response.json({ answer });
  } catch (err) {
    if (err?.status === 429) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please wait and try again.",
        }),
        { status: 429 }
      );
    }

    console.error(err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
