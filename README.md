
# Ben10 Alien Explorer

A full-stack Ben 10 explorer built with Next.js. It combines a searchable alien directory and Omnitrix-style interface with authenticated favorites and **Assist10**, a domain-specific RAG chat experience backed by PostgreSQL and Astra DB.

The project explores full-stack data flow: relational persistence for application data, external object storage for images, authenticated user state, and retrieval-augmented AI responses.

> Fan-made project for educational and portfolio purposes. Ben 10 characters, imagery, and related references belong to their respective rights holders.

## Screenshots

### Ben10 Alien Explorer
Home
<img width="1535" height="768" alt="Screenshot 2026-09-16 151546" src="https://github.com/user-attachments/assets/3f0fb0b5-3723-4b7a-9734-ea55636a8ebb" />
Explorer
<img width="1526" height="730" alt="Screenshot 2026-09-16 151612" src="https://github.com/user-attachments/assets/2003a42d-d354-4cd9-9db4-83a0eaa9d527" /> 
Assist10
<img width="1520" height="726" alt="Screenshot 2026-09-16 151704" src="https://github.com/user-attachments/assets/3cc61fc3-ebd4-490b-aef0-f51f6e16a290" />

[LIVE DEMO](https://ben10alienexplorer.vercel.app/)

## Features

- **Alien Explorer** — Browse aliens from Ben 10 Classic, Alien Force, and Ultimate Alien with search and series filtering.
- **Alien Details** — Dedicated alien pages with abilities, species, planet, appearances, descriptions, transformation imagery, and adjacent-alien navigation.
- **Omnitrix Directory** — Interactive Omnitrix-inspired interface for navigating the alien collection.
- **Authentication** — Better Auth with Google and GitHub sign-in, plus email/password support at the authentication layer.
- **Favorites** — Authenticated users can save and remove aliens from their personal collection.
- **Assist10** — Authenticated RAG chat that retrieves relevant Ben 10 knowledge from Astra DB before generating a streamed response with Gemini.
- **Chat History** — Conversations are persisted per user and can be loaded or cleared from the chat interface.
- **Feedback** — Validated feedback submissions are stored in PostgreSQL.

## Technical Highlights

The strongest engineering aspects of the project are the boundaries between data sources and application concerns:

- Alien data is served through internal Next.js API routes backed by PostgreSQL rather than requiring the original external API at runtime.
- React Query owns the server-fetched alien dataset, while a reducer manages explorer interaction state.
- Favorites are modeled relationally with database constraints rather than duplicating alien data.
- Assist10 uses vector retrieval to select relevant knowledge before generation instead of sending the entire knowledge source to the model.
- AI responses are streamed to the client, while completed conversations are persisted after generation.
- Chat requests have authentication, input checks, a 20-request-per-user-per-minute process-local rate limiter, and a short-lived model selection cache.

## Architecture

```text
Browser
   │
   ▼
Next.js App Router
   │
   ├── UI / React Query / Context + Reducer
   │
   ▼
Next.js Route Handlers
   │
   ├── PostgreSQL ── Prisma
   │      ├── Aliens
   │      ├── Users / Sessions
   │      ├── Favorites
   │      ├── Chat History
   │      └── Feedback
   │
   └── Assist10
          │
          ├── Gemini Embeddings
          │       ▼
          │   Astra DB Vector Search
          │       ▼
          └── Gemini Generation
                    │
                    ▼
               Streamed response
```

### Alien Data Flow

The explorer requests the three supported series concurrently:

```text
/api/aliens/classic
/api/aliens/alien-force
/api/aliens/ultimate-alien
             │
             ▼
        PostgreSQL / Prisma
             │
             ▼
       Combined client cache
             │
             ▼
      Search + series filtering
```

The database contains **59 seeded alien records** across the three series. Alien images and transformation images are stored in Cloudinary, with their URLs persisted in PostgreSQL.

### Database Responsibilities

The application uses PostgreSQL for structured, relational application data such as user accounts, authentication, favorites, and feedback. Astra DB is used separately as a vector database for storing and retrieving knowledge embeddings that support the Assist10 RAG workflow.

Maintaining two data stores introduces additional operational complexity, including separate configuration, monitoring, failure handling, and data-management workflows. This trade-off was accepted to keep relational application data separate from vector search workloads and to support semantic retrieval for AI-powered responses.

### Assist10 RAG Flow

```text
ben10-knowledge.txt
        │
        ▼
Text chunking
512 chars / 150 overlap
        │
        ▼
Gemini embeddings
3072 dimensions
        │
        ▼
Astra DB collection
Cosine similarity
        │
        ▼
Top 6 retrieved chunks
        │
        ▼
Prompt + recent conversation
        │
        ▼
Gemini generation
        │
        ▼
Text stream → client
        │
        ▼
Chat history → PostgreSQL
```

At ingestion time, the knowledge file is split into overlapping chunks and embedded as-is. At query time, the question is embedded and used for vector similarity retrieval. The six retrieved documents become the context supplied to the generation model.

### Chat API Request

The `/api/chat` endpoint accepts a user message and conversation context to generate an AI-powered response using the retrieval-augmented generation workflow.

```http
POST /api/chat
Content-Type: application/json

## Engineering Decisions & Trade-offs

### PostgreSQL for Application Data

Alien records, users, favorites, chat history, and feedback are persisted in PostgreSQL through Prisma.

The alien schema retains the original `sourceId` as a unique identifier while favorites reference the relational `Alien.id`. This lets the application preserve source identities without coupling favorites directly to the original data format.

### Cloudinary for Images

The migration script moves alien imagery to Cloudinary and stores the resulting secure URLs in PostgreSQL rather than storing image binaries in the relational database.

Uploads use deterministic public IDs and check for an existing asset first, making the migration safe to re-run without intentionally creating duplicate assets.

### React Query + Reducer

The alien roster is server data, so it is cached with React Query. Search, selected alien, series, and favorites-filter state are local explorer state managed by a reducer.

This keeps server-cache behavior separate from UI interaction state instead of placing both into one global state model.

### RAG Instead of the Full Knowledge Source

Assist10 retrieves only the most relevant chunks from Astra DB before generation. This reduces the amount of domain context sent to the model and gives the application a clear retrieval boundary.

The system prompt also instructs the model to use the retrieved information and restrict responses to Ben 10-related questions.

### Streaming with Post-response Persistence

The chat endpoint uses `streamText()` so the client receives the response incrementally. Chat history is written from `onFinish` after the complete response has been generated.

A failed history write is logged rather than replacing an already-delivered response with a server error.

## API Reference

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/aliens/[series]` | Fetch a series; optional `name` or `id` filters | No |
| `GET` | `/api/favorites` | Get the current user's favorite alien source IDs | Yes |
| `POST` | `/api/favorites` | Add an alien using `sourceId` | Yes |
| `DELETE` | `/api/favorites` | Remove an alien using `sourceId` | Yes |
| `POST` | `/api/chat` | Retrieve context and stream an Assist10 response | Yes |
| `GET` | `/api/chat/history` | Load the user's persisted conversation | Yes |
| `DELETE` | `/api/chat/history` | Clear the user's conversation | Yes |
| `POST` | `/api/feedback` | Validate and persist feedback | No |
| `GET/POST` | `/api/auth/[...all]` | Better Auth handlers | Auth |

Example favorite request:

```http
POST /api/favorites
Content-Type: application/json

{
  "sourceId": 1
}
```

The favorites endpoint validates `sourceId` with Zod and returns `400` for invalid input, `404` when the alien does not exist, `409` for an existing favorite, and `401` without a session.

The chat endpoint returns:

- `401` when unauthenticated
- `400` for an empty/invalid question
- `429` when the process-local rate limit is exceeded
- `500` for an unexpected server failure

## Security & Failure Handling

Security controls present in the implementation include:

- Better Auth session checks on protected API routes.
- Route-level protection for `/dashboard` and `/omnitrix`.
- Zod validation for favorites and feedback input.
- Database uniqueness constraints preventing duplicate favorites.
- Per-user chat rate limiting.
- Server-side API credentials loaded from environment variables rather than client code.
- Explicit handling of authentication, validation, upstream model, and database failures.

Assist10 also has a model fallback: the route probes the primary generation model and temporarily switches to `gemini-3.1-flash-lite` when the primary model cannot be resolved.

## Performance Considerations

The project contains several implementation-level optimizations, but no benchmark data is included in the repository.

- The three alien API requests are made concurrently with `Promise.all`.
- React Query keeps the mostly static alien roster cached for 10 minutes and avoids refetching it on window focus.
- Prisma, Astra DB, and Gemini clients are initialized for reuse within the running process.
- The RAG request retrieves six documents and sends at most the latest ten conversation messages to the model.
- Adjacent alien transformation images are preloaded.
- Several UI components use dynamic imports.

These are workload-specific optimizations rather than measured claims about overall application performance.

## Local Development

### Prerequisites

- Node.js and npm
- PostgreSQL
- Google OAuth credentials
- GitHub OAuth credentials
- Gemini API access
- Astra DB credentials

Cloudinary credentials are additionally required only when running the alien migration.

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure `.env`

For normal application use:

```env
DATABASE_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

ASTRA_DB_NAMESPACE=
ASTRA_DB_COLLECTION=
ASTRA_DB_API_ENDPOINT=
ASTRA_DB_APPLICATION_TOKEN=

GEMINI_API_KEY=
```

For the alien migration:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Apply Database Migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Start the Application

```bash
npm run dev
```

Open `http://localhost:3000`.

### Useful Commands

```bash
npm run lint
npm run build
npm run start
```

`npm run build` generates the Prisma client before creating the Next.js production build.

## Data & RAG Ingestion

These scripts are for preparing external data, not required on every application start.

### Migrate Alien Data

`scripts/migrateAliens.ts` reads the three JSON datasets under `scripts/migration-seed/data`, uploads their images to Cloudinary, and upserts the records into PostgreSQL.

```bash
npx tsx scripts/migrateAliens.ts
```

### Build the RAG Collection

`scripts/loadDb.ts` reads `ben10-knowledge.txt`, creates the Astra DB collection when necessary, chunks the source text, generates 3072-dimensional Gemini embeddings, and inserts the vectors.

```bash
npx tsx scripts/loadDb.ts
```

The ingestion configuration uses cosine similarity with 512-character chunks and 150-character overlap.

## Current Limitations

- The chat rate limiter is **process-local**. Multiple application instances would not share the same request counters.
- Chat history is stored as one JSON string per user rather than as individually normalized message records.
- The repository contains no automated application tests.
- No production deployment configuration or verified live demo URL is included.
- Assist10 depends on external Gemini and Astra DB services for retrieval and generation.

## Project Structure

```text
app/
├── api/                 # Route handlers
│   ├── aliens/
│   ├── auth/
│   ├── chat/
│   ├── favorites/
│   └── feedback/
├── alien/[name]/        # Alien detail route
├── dashboard/
├── explorer/
├── login/
└── omnitrix/

lib/
├── Store.tsx            # Alien server state + explorer state
├── auth.ts              # Better Auth server configuration
├── auth-client.ts       # Client auth helpers
├── prisma.ts            # Prisma client
└── queryClient.ts       # React Query client

prisma/
└── schema.prisma

scripts/
├── loadDb.ts            # RAG ingestion
└── migrateAliens.ts     # PostgreSQL + Cloudinary migration

ben10-knowledge.txt      # RAG source knowledge
```

## Found something to fix?

Since I am a developer who is always learning, I might have missed something! If you find a bug or have a suggestion on how I can make the logic better, please feel free to open an Issue or send a Pull Request. I would love to learn from your feedback!

## Disclaimer

This is a fan-made project created for educational and portfolio purposes.

Ben 10 characters, imagery, names, and related references belong to their respective rights holders. This project is not affiliated with or endorsed by those rights holders.

## License

No license file is included in the repository, so no open-source license is currently specified.

## Like this project?

If you are feeling generous, [Buy me a Coffee!](https://ko-fi.com/paneerselvam)
