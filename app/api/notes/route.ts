import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const isPersonal = searchParams.get("isPersonal") === "true";

    await connectDB();

    let query: any = {};
    if (subjectId) query.subjectId = subjectId;

    if (isPersonal) {
      query.isPersonal = true;
      query.createdBy = (session.user as any).id;
    } else {
      query.isPersonal = false;
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, fileUrl, fileType, subjectId, isPersonal } = body;

    if (!isPersonal && (session.user as any).role === "student") {
      return NextResponse.json(
        { error: "Students cannot upload organizational notes" },
        { status: 403 },
      );
    }

    await connectDB();
    const note = await Note.create({
      title,
      fileUrl,
      fileType,
      subjectId,
      isPersonal,
      createdBy: (session.user as any).id,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error: any) {
    console.error("POST Note Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create note" },
      { status: 500 },
    );
  }
}
