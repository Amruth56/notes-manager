"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-orange-600 flex items-center gap-2">
          <span className="bg-orange-600 text-white p-1 rounded">NM</span>
          Notes<span className="text-gray-900">Manager</span>
        </Link>

        <div className="flex items-center gap-6">
          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-orange-600 transition">Dashboard</Link>
              <Link href="/personal" className="text-gray-600 hover:text-orange-600 transition">Personal</Link>
              {((session.user as any).role === "cr" || (session.user as any).role === "professor") && (
                <Link href="/upload" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
                  Upload Notes
                </Link>
              )}
              <div className="flex items-center gap-3 ml-4 border-l pl-6 border-gray-100">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{(session.user as any).role}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-sm text-gray-500 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <Link href="/login" className="text-gray-600 hover:text-orange-600 font-medium pt-2 transition">
                Login
              </Link>
              <Link href="/register" className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
