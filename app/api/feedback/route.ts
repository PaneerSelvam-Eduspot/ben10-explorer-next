import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try{
        const body = await req.json();
        const { email, comment } = body;

        if(!email || !comment || !comment.length || comment.length > 2000){
            return NextResponse.json({ message: "Missing email or comment, the comment length exceeded" }, {status: 400});
        }
        const newFeedback = await prisma.feedback.create({ data: {
            email: email,
            comment: comment,  
        }});
        return NextResponse.json({ message: "Row created successfully"}, {status: 201});
    } catch (error) {
        console.error("Error saving feedback:", error);
        return NextResponse.json( {message: "Something went wrong" }, {status: 500});
    }
}