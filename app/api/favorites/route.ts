import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }


  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      select: { alienName: true },
    })
    return NextResponse.json({
    favorites: favorites.map(f => f.alienName),
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}


//POST - Add favorite
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }


  try {
    const { alienName} = await req.json();

    if (!alienName) {
      return NextResponse.json({ error: 'Alien name is required'}, { status: 400 });
    }
  

   const favorite = await prisma.favorite.create({
    data: {
      userId: session.user.id,
      alienName,
    },
   });

   return NextResponse.json({ succes: true, favorite });
    } catch (error: any) {
      // duplicate favorite error
      if(error.code === 'P2002') {
        return NextResponse.json({ error: 'Already in favroites'}, { status: 409 });
      }
      console.error('Error addding favorite:', error);
      return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
      }
}



// DELETE - Remove favorite
export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { alienName } = await req.json();

    if (!alienName) {
      return NextResponse.json({ error: 'Alien name is required'}, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: session.user.id,
        alienName,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}