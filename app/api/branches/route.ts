import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Branch from "@/models/Branch";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDB();
    const branches = await Branch.find({});
    return NextResponse.json(branches);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch branches" },
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
        { error: "Only professors and CRs can create branches" },
        { status: 403 },
      );
    }

    const { name } = await req.json();
    await connectDB();
    const branch = await Branch.create({ name });
    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create branch" },
      { status: 500 },
    );
  }
}
