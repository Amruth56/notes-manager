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
              <div className="relative group ml-4">
                <button className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700 font-bold hover:bg-orange-200 transition">
                  {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-semibold text-gray-900 truncate">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{(session.user as any).role}</p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2 transition"
                  >
                    Logout
                  </button>
                </div>
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
