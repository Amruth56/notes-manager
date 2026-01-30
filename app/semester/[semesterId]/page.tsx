"use client";

import ResourceCard from "@/components/ResourceCard";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchSubjects } from "@/lib/api";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function SemesterPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const semesterId = params?.semesterId as string;

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ["subjects", semesterId],
    queryFn: () => fetchSubjects(semesterId),
    enabled: !!semesterId,
  });

  if (status === "loading" || isLoading) {
    return <div className="p-8 text-center">Loading subjects...</div>;
  }
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="py-8">
      <Link href="/dashboard" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-6">
        <ArrowBackIcon className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Subjects</h1>
        <p className="text-gray-500 text-lg">Browse topics and materials for this semester.</p>
      </header>

      {subjects.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400">No subjects found for this semester.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject: any) => (
            <ResourceCard
              key={subject._id}
              title={subject.name}
              subtitle="Course Unit"
              href={`/subject/${subject._id}`}
              icon={<MenuBookIcon className="w-6 h-6" />}
            />
          ))}
        </div>
      )}
    </div>
  );
}