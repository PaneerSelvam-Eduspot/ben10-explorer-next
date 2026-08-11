import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const assetDirs = {
  image: path.join(process.cwd(), 'scripts', 'migration-seed', 'images', 'image'),
  transform: path.join(process.cwd(), 'scripts', 'migration-seed', 'images', 'transformimg'),
} as const;

const contentTypes: Record<string, string> = {
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kind: string; filename: string }> }
) {
  const { kind, filename } = await params;

  if (kind !== 'image' && kind !== 'transform') {
    return NextResponse.json({ message: 'Asset type not found' }, { status: 404 });
  }

  const safeFilename = path.basename(filename);
  const filePath = path.join(assetDirs[kind], safeFilename);

  try {
    const file = await fs.readFile(filePath);
    const contentType = contentTypes[path.extname(safeFilename).toLowerCase()] ?? 'application/octet-stream';

    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
  }
}
