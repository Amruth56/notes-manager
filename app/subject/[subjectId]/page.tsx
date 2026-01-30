"use client";

import NoteCard from "@/components/NoteCard";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes, fetchSubject } from "@/lib/api";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';

export default function SubjectPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const subjectId = params?.subjectId as string;

  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ["notes", subjectId],
    queryFn: () => fetchNotes({ subjectId, isPersonal: false }),
    enabled: !!subjectId,
  });

  const { data: subject, isLoading: subjectLoading } = useQuery({
    queryKey: ["subject", subjectId],
    queryFn: () => fetchSubject(subjectId),
    enabled: !!subjectId,
  });

  const semester = subject?.semesterId;
  const branch = semester?.branchId;

  if (status === "loading" || notesLoading || subjectLoading) {
    return <div className="p-8 text-center">Loading Content...</div>;
  }
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="">
      <Link href="/dashboard" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-6">
        <ArrowBackIcon className="w-4 h-4 mr-2" />
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
      </header>

      {notes.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <DescriptionIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
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
