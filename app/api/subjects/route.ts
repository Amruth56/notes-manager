import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subject from "@/models/Subject";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const semesterId = searchParams.get("semesterId");

    await connectDB();
    const query = semesterId ? { semesterId } : {};
    const subjects = await Subject.find(query);
    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
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
        { error: "Only professors and CRs can create subjects" },
        { status: 403 },
      );
    }

    const { name, semesterId } = await req.json();
    await connectDB();
    const subject = await Subject.create({ name, semesterId });
    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 },
    );
  }
}
