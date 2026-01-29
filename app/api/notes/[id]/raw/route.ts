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

    // Parse the data URL
    // Format: data:[<mediatype>][;base64],<data>
    const matches = note.fileUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      // If it's not a base64 data URL, just redirect to it (assume it's a normal URL)
      return NextResponse.redirect(note.fileUrl);
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${note.title}.${note.fileType}"`, // inline = open in browser, attachment = download
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error serving raw note:", error);
    return NextResponse.json({ error: "Failed to load note" }, { status: 500 });
  }
}
