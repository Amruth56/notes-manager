"use client";

import ResourceCard from "@/components/ResourceCard";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchSemesters } from "@/lib/api";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

export default function BranchPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const branchId = params?.branchId as string;

  const { data: semesters = [], isLoading } = useQuery({
    queryKey: ["semesters", branchId],
    queryFn: () => fetchSemesters(branchId),
    enabled: !!branchId,
  });

  if (status === "loading" || isLoading) {
    return <div className="p-8 text-center">Loading semesters...</div>;
  }
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="py-8">
      <Link href="/dashboard" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-6">
        <ArrowBackIcon className="w-4 h-4 mr-2" />
        Back to Branches
      </Link>

      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Semesters</h1>
        <p className="text-gray-500 text-lg">Select a semester to see subjects and courses.</p>
      </header>

      {semesters.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400">No semesters found for this branch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {semesters.map((sem: any) => (
            <ResourceCard
              key={sem._id}
              title={`Semester ${sem.number}`}
              subtitle="Academic Term"
              href={`/semester/${sem._id}`}
              icon={<LibraryBooksIcon className="w-6 h-6" />}
            />
          ))}
        </div>
      )}
    </div>
  );
}
