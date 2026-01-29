"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface NoteCardProps {
  note: {
    _id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    createdAt: string;
    createdBy: string;
  };
}

export default function NoteCard({ note }: NoteCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(note.title);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isPdf = note.fileType === "pdf";
  const isOwner = session?.user && (session.user as any).id === note.createdBy;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/notes/${note._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete note");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting note");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    if (!newTitle.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/notes/${note._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        setIsEditing(false);
        router.refresh();
      } else {
        alert("Failed to update note");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 relative group">
      {/* Action Buttons for Owner */}
      {isOwner && (
        <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-lg backdrop-blur-sm">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            )}
          </button>
        </div>
      )}

      <div className="h-40 bg-gray-50 flex items-center justify-center relative cursor-pointer" onClick={() => window.open(`/api/notes/${note._id}/raw`, "_blank")}>
        {isPdf ? (
          <svg className="w-16 h-16 text-orange-200 group-hover:text-orange-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A1 1 0 0111.293 2.707l4 4a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        ) : (
          <img src={note.fileUrl} alt={note.title} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="p-4">
        {isEditing ? (
          <div className="mb-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm mb-2 focus:ring-2 focus:ring-orange-500 outline-none"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSaving}
                className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <h4 className="font-bold text-gray-900 mb-1 truncate cursor-pointer hover:text-orange-600 transition" title={note.title} onClick={() => window.open(`/api/notes/${note._id}/raw`, "_blank")}>
            {note.title}
          </h4>
        )}
        
        <p className="text-xs text-gray-400 mb-4">{new Date(note.createdAt).toLocaleDateString()}</p>
        
        <div className="flex gap-2">
          <button
            onClick={() => window.open(`/api/notes/${note._id}/raw`, "_blank")}
            className="flex-1 bg-orange-50 text-orange-600 font-semibold py-2 rounded-lg text-sm hover:bg-orange-600 hover:text-white transition-all shadow-sm"
          >
            Review
          </button>
          <a
            href={note.fileUrl}
            download={note.title}
            className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-all border border-gray-100"
            title="Download"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </a>
        </div>
      </div>
    </div>
  );
}
