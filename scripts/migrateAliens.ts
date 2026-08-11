/**
 * One-time migration: ben10-api (MongoDB) -> ben10-explorer (Postgres + Cloudinary)
 *
 * What this does:
 *   1. Reads the three static seed JSON files that used to back the Mongo API
 *      (data/classic.json, data/alien-force.json, data/ultimate-alien.json).
 *   2. Uploads each alien's `image` and `transform` files to Cloudinary,
 *      under a stable public_id so re-runs are idempotent (no duplicate uploads).
 *   3. Upserts each alien into Postgres via Prisma, storing the Cloudinary
 *      secure_url in place of the old filename.
 *
 * Usage:
 *   npx tsx scripts/migrateAliens.ts
 *
 * Safe to re-run: uses `upsert` on Alien.sourceId and Cloudinary overwrite:false
 * with deterministic public_ids, so nothing gets duplicated.
 */

import fs from "fs/promises";
import path from "path";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

// ── Env checks ────────────────────────────────────────────────────────────
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  DATABASE_URL,
} = process.env;

if (
  !CLOUDINARY_CLOUD_NAME ||
  !CLOUDINARY_API_KEY ||
  !CLOUDINARY_API_SECRET ||
  !DATABASE_URL
) {
  throw new Error(
    "❌ Missing required env vars. Need CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, DATABASE_URL in .env"
  );
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ── Types ─────────────────────────────────────────────────────────────────
interface RawAlien {
  id: number;
  name: string;
  species: string;
  planet: string;
  abilities: string;
  image: string; // filename, e.g. "swampfire.webp"
  transform: string; // filename, e.g. "swampfire.png"
  series: string;
  firstAppearance: string;
  description: string;
}

const SEED_DIR = path.join(process.cwd(), "scripts", "migration-seed");
const DATA_FILES = ["classic.json", "alien-force.json", "ultimate-alien.json"];
const IMAGE_DIR = path.join(SEED_DIR, "images", "image");
const TRANSFORM_DIR = path.join(SEED_DIR, "images", "transformimg");

// ── Cloudinary upload with idempotent public_id ─────────────────────────────
async function uploadIfNeeded(
  localFilePath: string,
  folder: string,
  publicId: string
): Promise<string> {
  try {
    // If it already exists in Cloudinary, reuse it — skip re-upload.
    const existing = await cloudinary.api.resource(`${folder}/${publicId}`);
    if (existing?.secure_url) return existing.secure_url;
  } catch {
    // Not found — fall through to upload.
  }

  const result = await cloudinary.uploader.upload(localFilePath, {
    folder,
    public_id: publicId,
    overwrite: false,
    resource_type: "image",
  });

  return result.secure_url;
}

function slugFromFilename(filename: string): string {
  return path.parse(filename).name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// ── Main ──────────────────────────────────────────────────────────────────
async function migrate() {
  let total = 0;
  let succeeded = 0;
  let failed = 0;

  for (const file of DATA_FILES) {
    const filePath = path.join(SEED_DIR, "data", file);
    const raw = await fs.readFile(filePath, "utf-8");
    const aliens: RawAlien[] = JSON.parse(raw);

    console.log(`\n📄 ${file} — ${aliens.length} aliens`);

    for (const alien of aliens) {
      total++;
      try {
        const imageLocalPath = path.join(IMAGE_DIR, alien.image);
        const transformLocalPath = path.join(TRANSFORM_DIR, alien.transform);

        const imageSlug = `${alien.id}-${slugFromFilename(alien.image)}`;
        const transformSlug = `${alien.id}-${slugFromFilename(alien.transform)}-transform`;

        const [imageUrl, transformUrl] = await Promise.all([
          uploadIfNeeded(imageLocalPath, "ben10/aliens/image", imageSlug),
          uploadIfNeeded(transformLocalPath, "ben10/aliens/transform", transformSlug),
        ]);

        await prisma.alien.upsert({
          where: { sourceId: alien.id },
          update: {
            name: alien.name,
            species: alien.species,
            planet: alien.planet,
            abilities: alien.abilities,
            image: imageUrl,
            transform: transformUrl,
            series: alien.series,
            firstAppearance: alien.firstAppearance,
            description: alien.description,
          },
          create: {
            sourceId: alien.id,
            name: alien.name,
            species: alien.species,
            planet: alien.planet,
            abilities: alien.abilities,
            image: imageUrl,
            transform: transformUrl,
            series: alien.series,
            firstAppearance: alien.firstAppearance,
            description: alien.description,
          },
        });

        succeeded++;
        console.log(`  ✅ ${alien.name}`);
      } catch (err: any) {
        failed++;
        console.error(`  ❌ ${alien.name} — ${err?.message ?? err}`);
      }
    }
  }

  console.log(`\n─────────────────────────────`);
  console.log(`Total: ${total}  ✅ ${succeeded}  ❌ ${failed}`);
  console.log(`─────────────────────────────`);
}

migrate()
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
