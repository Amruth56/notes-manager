import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subject from "@/models/Subject";
import Semester from "@/models/Semester";
import Branch from "@/models/Branch";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    await Promise.all([Semester.init(), Branch.init()]).catch(() => {});

    const subject = await Subject.findById(id).populate({
      path: "semesterId",
      model: Semester,
      populate: {
        path: "branchId",
        model: Branch,
      },
    });

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json(subject);
  } catch (error) {
    console.error("Error fetching subject:", error);
    return NextResponse.json(
      { error: "Failed to fetch subject" },
      { status: 500 },
    );
  }
}
