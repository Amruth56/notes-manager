import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
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

    const matches = note.fileUrl.match(
      /^data:([a-zA-Z0-9.+\/-]+);base64,(.+)$/,
    );

    if (!matches || matches.length !== 3) {
      if (note.fileUrl.startsWith("data:")) {
        console.error("Failed to parse data URL for note:", id);
        return NextResponse.json(
          { error: "Invalid data URL format" },
          { status: 500 },
        );
      }
      return NextResponse.redirect(note.fileUrl);
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${note.title}.${note.fileType}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error serving raw note:", error);
    return NextResponse.json({ error: "Failed to load note" }, { status: 500 });
  }
}
