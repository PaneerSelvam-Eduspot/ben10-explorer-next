import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Same slug -> series-name mapping the old ben10-api used, kept identical
// so the frontend's SERIES_SLUGS in lib/Store.tsx doesn't need to change.
const seriesMap: Record<string, string> = {
  'classic': 'Ben 10 Classic',
  'alien-force': 'Ben 10 Alien Force',
  'ultimate-alien': 'Ben 10 Ultimate Alien',
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
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

    // image/transform are already full Cloudinary URLs — no local fallback,
    // no baseUrl prefixing needed. If this is empty, the DB genuinely has no
    // matching rows — that's a real signal to re-run scripts/migrateAliens.ts,
    // not something to paper over with a JSON file read.
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
