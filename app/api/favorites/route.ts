import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

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
      select: { alien: { select: { sourceId : true }}}
    })
    return NextResponse.json({
    favorites: favorites.map(f => f.alien?.sourceId),
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

const requestSchema = z.object({
   sourceId: z.number().positive().int()
})

//POST - Add favorite
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  

  try {
    const body = await req.json();

    const { sourceId } = requestSchema.parse(body);

    const alien = await prisma.alien.findUnique({
      where: { sourceId }
    })

    if(!alien){
      return NextResponse.json({ error: "The alien doesn't exist" }, { status: 404 });
    }

   const favorite = await prisma.favorite.create({
    data: {
      userId: session.user.id,
      alienId: alien.id,
    },
   });

   return NextResponse.json({ favorite }, { status: 201 });
  } catch (error: any) {
     
      if (error instanceof z.ZodError){
        return NextResponse.json(
          {error: 'Invalid or missing sourceId', details: error.issues},
          {status: 400}
        )
      }
      // duplicate favorite error
      if(error.code === 'P2002') {
        return NextResponse.json({ error: 'Already in favotites'}, { status: 409 });
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
    const body = await req.json();

    const { sourceId } = requestSchema.parse(body);

    const alien = await prisma.alien.findUnique({
      where: { sourceId }
    })

    if(!alien) {
      return NextResponse.json({ error: "The alien doesn't exist" }, { status: 404 });
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: session.user.id,
        alienId: alien.id,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError){
      return NextResponse.json(
        {error: 'Invalid or missing sourceId', details: error.issues},
        {status: 400}
      )
    }
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}