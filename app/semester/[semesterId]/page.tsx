import ResourceCard from "@/components/ResourceCard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Link from "next/link";

async function getSubjects(semesterId: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/subjects?semesterId=${semesterId}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function SemesterPage({ params }: { params: { semesterId: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const { semesterId } = await params;
  const subjects = await getSubjects(semesterId);

  return (
    <div className="py-8">
      <Link href="/dashboard" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-6">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
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
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            />
          ))}
        </div>
      )}
    </div>
  );
}
