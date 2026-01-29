import ResourceCard from "@/components/ResourceCard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";

async function getSemesters(branchId: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/semesters?branchId=${branchId}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function BranchPage({ params }: { params: { branchId: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const { branchId } = await params;
  const semesters = await getSemesters(branchId);

  return (
    <div className="py-8">
      <Link href="/dashboard" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-6">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
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
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
