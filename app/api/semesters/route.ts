import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Semester from "@/models/Semester";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get("branchId");

    await connectDB();
    const query = branchId ? { branchId } : {};
    const semesters = await Semester.find(query).sort({ number: 1 });
    return NextResponse.json(semesters);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch semesters" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!session || (userRole !== "professor" && userRole !== "cr")) {
      return NextResponse.json(
        { error: "Only professors and CRs can create semesters" },
        { status: 403 },
      );
    }

    const { number, branchId } = await req.json();
    await connectDB();
    const semester = await Semester.create({ number, branchId });
    return NextResponse.json(semester, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create semester" },
      { status: 500 },
    );
  }
}
