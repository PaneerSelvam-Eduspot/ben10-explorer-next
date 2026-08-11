import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

// Same slug -> series-name mapping the old ben10-api used, kept identical
// so the frontend's SERIES_SLUGS in lib/Store.tsx doesn't need to change.
const seriesMap: Record<string, string> = {
  'classic': 'Ben 10 Classic',
  'alien-force': 'Ben 10 Alien Force',
  'ultimate-alien': 'Ben 10 Ultimate Alien',
};

type RawAlien = {
  id: number;
  name: string;
  species: string;
  planet: string;
  abilities: string;
  image: string;
  transform: string;
  series: string;
  firstAppearance: string;
  description: string;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

function shapeAlien(a: RawAlien) {
  return {
    _id: String(a.id),
    id: a.id,
    name: a.name,
    species: a.species,
    planet: a.planet,
    abilities: a.abilities,
    image: `/api/alien-assets/image/${encodeURIComponent(a.image)}`,
    transform: `/api/alien-assets/transform/${encodeURIComponent(a.transform)}`,
    series: a.series,
    firstAppearance: a.firstAppearance,
    description: a.description,
  };
}

async function readSeedAliens(seriesParam: string, name: string | null, id: string | null) {
  const filePath = path.join(process.cwd(), 'scripts', 'migration-seed', 'data', `${seriesParam}.json`);
  const raw = await fs.readFile(filePath, 'utf-8');
  const aliens = JSON.parse(raw) as RawAlien[];

  return aliens
    .filter((alien) => {
      const nameMatch = !name || alien.name.toLowerCase().includes(name.toLowerCase());
      const idMatch = !id || alien.id === Number(id);
      return nameMatch && idMatch;
    })
    .map(shapeAlien);
}

// GET /api/aliens/:series?name=&id=
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ series: string }> }
) {
  try {
    const { series: seriesParam } = await params;
    const seriesName = seriesMap[seriesParam];

    if (!seriesName) {
      return NextResponse.json({ message: 'Series not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const id = searchParams.get('id');

    const aliens = await prisma.alien.findMany({
      where: {
        series: seriesName,
        ...(name ? { name: { contains: name, mode: 'insensitive' } } : {}),
        ...(id ? { sourceId: Number(id) } : {}),
      },
      orderBy: { sourceId: 'asc' },
    });

    // image/transform are already full Cloudinary URLs — no baseUrl prefixing needed.
    if (aliens.length === 0) {
      return NextResponse.json(await readSeedAliens(seriesParam, name, id));
    }

    const shaped = aliens.map((a) => ({
      _id: a.id,
      id: a.sourceId,
      name: a.name,
      species: a.species,
      planet: a.planet,
      abilities: a.abilities,
      image: a.image,
      transform: a.transform,
      series: a.series,
      firstAppearance: a.firstAppearance,
      description: a.description,
    }));

    return NextResponse.json(shaped);
  } catch (error: unknown) {
    console.error('Error fetching aliens:', error);
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 500 });
  }
}
