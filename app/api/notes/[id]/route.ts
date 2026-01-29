import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Only owner can delete
    if (note.createdBy.toString() !== (session.user as any).id) {
      return NextResponse.json(
        { error: "Unauthorized: You do not own this note" },
        { status: 403 },
      );
    }

    await Note.findByIdAndDelete(id);
    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title } = body;

    await connectDB();

    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Only owner can update
    if (note.createdBy.toString() !== (session.user as any).id) {
      return NextResponse.json(
        { error: "Unauthorized: You do not own this note" },
        { status: 403 },
      );
    }

    note.title = title;
    await note.save();

    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 },
    );
  }
}
