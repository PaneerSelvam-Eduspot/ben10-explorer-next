import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

// GET - Fetch chat history for logged-in user
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // ✅ prisma.chatHistory.findUnique — was prisma.ChatHistory() which is not a function
    const chatHistory = await prisma.chatHistory.findUnique({
      where: { userId },
    });

    // messages is a JSON string in the DB — parse it back to array for the frontend
    const messages = chatHistory?.messages
      ? JSON.parse(chatHistory.messages)
      : [];

    return NextResponse.json({ messages });

  } catch (error) {
    console.error('[history/route] GET:', error);
    return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 });
  }
}

// POST - Save chat history for logged-in user
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages must be an array' }, { status: 400 });
    }

    // ✅ prisma.chatHistory.upsert — was prisma.ChatHistory.upsert (crashes)
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

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[history/route] POST:', error);
    return NextResponse.json({ error: 'Failed to save chat history' }, { status: 500 });
  }
}

// DELETE - Clear chat history for logged-in user
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // ✅ prisma.chatHistory.delete — was prisma.ChatHistory.delete (crashes)
    await prisma.chatHistory.delete({
      where: { userId },
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    // P2025 = record not found — history was already empty, treat as success
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: true });
    }
    console.error('[history/route] DELETE:', error);
    return NextResponse.json({ error: 'Failed to clear chat history' }, { status: 500 });
  }
}