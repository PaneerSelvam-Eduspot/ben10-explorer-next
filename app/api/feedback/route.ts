import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as z from "zod";

const requestSchema = z.object({
    email: z.email(),
    comment: z.string().min(2, "Too short").max(2000, "Too long")
})

export async function POST(req: NextRequest) {
    try{
        const body = await req.json();
        const { email, comment } = requestSchema.parse(body);

        await prisma.feedback.create({ data: {
            email: email,
            comment: comment,  
        }});
        return NextResponse.json({ success: true}, {status: 201});
    } catch (error) {
        if (error instanceof z.ZodError){
            return NextResponse.json(
                {error: 'Invalid or missing Email or comment', details: error.issues},
                {status: 400}
            )
        }
        console.error("Error saving feedback:", error);
        return NextResponse.json( { error: "Something went wrong" }, {status: 500});
    }
}