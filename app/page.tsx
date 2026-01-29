import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-orange-600 uppercase bg-orange-50 rounded-full">
        Academic Success Simplified
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
        Master Your Courses with <br />
        <span className="text-orange-600">Smart Notes Manager</span>
      </h1>
      <p className="max-w-2xl text-xl text-gray-500 mb-10 leading-relaxed">
        The centralized hub for IIIT Dharwad engineering students. Access verified resources, 
        organized by branch, semester, and subject.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {session ? (
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition transform hover:scale-105"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="px-8 py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition transform hover:scale-105"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-orange-600 border border-orange-200 font-bold rounded-2xl hover:bg-orange-50 transition transform hover:scale-105"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      <div id="features" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Structured Hierarchy</h3>
          <p className="text-gray-500">Easily navigate through Branch, Semester, and Subject to find exactly what you need.</p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Secure Storage</h3>
          <p className="text-gray-500">Your personal notes are private, while organizational notes are verified by CRs and Professors.</p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
          <p className="text-gray-500">Optimized for performance with SSR and global CDN delivery for your documents.</p>
        </div>
      </div>
    </div>
  );
}
