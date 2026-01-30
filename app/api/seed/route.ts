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

    await Branch.deleteMany({});
    await Semester.deleteMany({});
    await Subject.deleteMany({});

    const branchesList = [
      "Computer Science & Engineering",
      "Data Science & AI",
      "Electronics & Communication",
      "Electrical & Electronics Engineering",
    ];

    for (const branchName of branchesList) {
      const branch = await Branch.create({ name: branchName });

      for (let i = 1; i <= 8; i++) {
        const semester = await Semester.create({
          number: i,
          branchId: branch._id,
        });

        if (branchName === "Computer Science & Engineering" && i === 5) {
          await Subject.create({
            name: "Database Management Systems",
            semesterId: semester._id,
          });
          await Subject.create({
            name: "Software Engineering",
            semesterId: semester._id,
          });
          await Subject.create({
            name: "Computer Networks",
            semesterId: semester._id,
          });
          await Subject.create({
            name: "Formal Languages & Automata",
            semesterId: semester._id,
          });
        }
      }
    }

    return NextResponse.json({
      message: "Database seeded successfully!",
      branches: branchesList,
      semesters: "8 per branch",
      subjects: "4 for CSE Semester 5 (Demo Data)",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
