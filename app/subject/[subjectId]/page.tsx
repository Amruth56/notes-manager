import NoteCard from "@/components/NoteCard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Link from "next/link";

import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import Subject from "@/models/Subject";
import Semester from "@/models/Semester";
import Branch from "@/models/Branch";

async function getNotes(subjectId: string) {
  try {
    await connectDB();
    const notes = await Note.find({ 
      subjectId, 
      isPersonal: false 
    }).sort({ createdAt: -1 });
    
    // Serialize for Client Component
    return JSON.parse(JSON.stringify(notes));
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

async function getSubjectDetails(subjectId: string) {
  try {
    await connectDB();
    // Ensure models are registered
    await Promise.all([Semester.init(), Branch.init()]).catch(() => {});
    
    const subject = await Subject.findById(subjectId).populate({
      path: "semesterId",
      model: Semester,
      populate: {
        path: "branchId",
        model: Branch
      }
    });

    if (!subject) return null;
    return JSON.parse(JSON.stringify(subject));
  } catch (error) {
    console.error("Error fetching subject details:", error);
    return null;
  }
}

export default async function SubjectPage({ params }: { params: { subjectId: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const { subjectId } = await params;
  const notes = await getNotes(subjectId);
  const subject = await getSubjectDetails(subjectId);

  const semester = subject?.semesterId;
  const branch = semester?.branchId;

  return (
    <div className="py-8">
      <Link href="/dashboard" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-6">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Dashboard
      </Link>

      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          {subject ? (
            <>
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 mb-2 uppercase tracking-wide">
                <span>{branch?.name || "Unknown Branch"}</span>
                <span className="text-gray-300">•</span>
                <span>Semester {semester?.number || "?"}</span>
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{subject.name}</h1>
            </>
          ) : (
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Subject Notes</h1>
          )}
          <p className="text-gray-500 text-lg">Download or view PDFs and images for this unit.</p>
        </div>
        {((session.user as any).role === "cr" || (session.user as any).role === "professor") && (
          <Link href={`/upload?subjectId=${subjectId}`} className="bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-orange-700 transition shadow-lg shadow-orange-200">
            Upload New Note
          </Link>
        )}
      </header>

      {notes.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <p className="text-gray-400">No notes uploaded for this subject yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {notes.map((note: any) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
