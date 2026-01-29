import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Branch from "@/models/Branch";
import Semester from "@/models/Semester";
import Subject from "@/models/Subject";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not allowed in production" },
      { status: 403 },
    );
  }

  try {
    await connectDB();

    // Clear existing data (optional, be careful)
    await Branch.deleteMany({});
    await Semester.deleteMany({});
    await Subject.deleteMany({});

    // 1. Create Branches
    const cse = await Branch.create({ name: "Computer Science & Engineering" });
    const dsai = await Branch.create({ name: "Data Science & AI" });
    const ece = await Branch.create({ name: "Electronics & Communication" });
    const eee = await Branch.create({
      name: "Electrical & Electronics Engineering",
    });

    // 2. Create Semesters for CSE
    const semesters = [];
    for (let i = 1; i <= 8; i++) {
      const sem = await Semester.create({ number: i, branchId: cse._id });
      semesters.push(sem);
    }

    // 3. Create Subjects for CSE Semester 5 (example)
    const sem5 = semesters[4];
    await Subject.create({
      name: "Database Management Systems",
      semesterId: sem5._id,
    });
    await Subject.create({
      name: "Software Engineering",
      semesterId: sem5._id,
    });
    await Subject.create({ name: "Computer Networks", semesterId: sem5._id });
    await Subject.create({
      name: "Formal Languages & Automata",
      semesterId: sem5._id,
    });

    // 4. Create Semesters for other branches
    for (let i = 1; i <= 8; i++) {
      await Semester.create({ number: i, branchId: dsai._id });
      await Semester.create({ number: i, branchId: ece._id });
      await Semester.create({ number: i, branchId: eee._id });
    }

    return NextResponse.json({
      message: "Database seeded successfully!",
      branches: ["CSE", "DSAI", "ECE", "EEE"],
      semesters: "8 per branch",
      subjects: "4 for CSE Semester 5",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
