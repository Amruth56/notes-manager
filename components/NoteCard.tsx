"use client";

interface NoteCardProps {
  note: {
    _id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    createdAt: string;
  };
}

export default function NoteCard({ note }: NoteCardProps) {
  const isPdf = note.fileType === "pdf";

  const handleDownload = () => {
    window.open(note.fileUrl, "_blank");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-40 bg-gray-50 flex items-center justify-center relative group">
        {isPdf ? (
          <svg className="w-16 h-16 text-orange-200 group-hover:text-orange-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A1 1 0 0111.293 2.707l4 4a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        ) : (
          <img src={note.fileUrl} alt={note.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/10 transition-colors" />
      </div>

      <div className="p-5">
        <h4 className="font-bold text-gray-900 mb-1 truncate" title={note.title}>{note.title}</h4>
        <p className="text-xs text-gray-400 mb-4">{new Date(note.createdAt).toLocaleDateString()}</p>
        
        <div className="flex gap-2">
          <button
            onClick={() => window.open(note.fileUrl, "_blank")}
            className="flex-1 bg-orange-50 text-orange-600 font-semibold py-2 rounded-lg text-sm hover:bg-orange-600 hover:text-white transition-all"
          >
            View
          </button>
          <a
            href={note.fileUrl}
            download
            className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </a>
        </div>
      </div>
    </div>
  );
}
