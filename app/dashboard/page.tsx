"use client";

import ResourceCard from "@/components/ResourceCard";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchBranches } from "@/lib/api";
import SchoolIcon from '@mui/icons-material/School';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const { data: branches = [], isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  if (status === "loading" || isLoading) {
    return <div className="p-8 text-center">Loading branches...</div>;
  }
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="py-8">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Academic Branches</h1>
        <p className="text-gray-500 text-lg">Select your branch to view semesters and subjects.</p>
      </header>

      {branches.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400">No branches found. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch: any) => (
            <ResourceCard
              key={branch._id}
              title={branch.name}
              subtitle="IIIT Dharwad Department"
              href={`/branch/${branch._id}`}
              icon={<SchoolIcon className="w-6 h-6" />}
            />
          ))}
        </div>
      )}
    </div>
  );
}