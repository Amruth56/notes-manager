import NoteCard from "@/components/NoteCard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";

import { connectDB } from "@/lib/db";
import Note from "@/models/Note";

async function getPersonalNotes(userId: string) {
  try {
    await connectDB();
    const notes = await Note.find({ 
      isPersonal: true,
      createdBy: userId
    }).sort({ createdAt: -1 });
    
    // Serialize for Client Component
    return JSON.parse(JSON.stringify(notes));
  } catch (error) {
    console.error("Error fetching personal notes:", error);
    return [];
  }
}

export default async function PersonalPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const notes = await getPersonalNotes((session.user as any).id);

  return (
    <div className="py-8">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Personal Notes</h1>
          <p className="text-gray-500 text-lg">Your private study collection, visible only to you.</p>
        </div>
        <Link href="/upload" className="bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-orange-700 transition">
          New Personal Note
        </Link>
      </header>

      {notes.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          <p className="text-gray-400">You haven't uploaded any personal notes yet.</p>
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
