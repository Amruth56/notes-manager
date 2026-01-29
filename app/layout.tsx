import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notes Manager | IIIT Dharwad",
  description: "Secure, structured academic notes management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen pt-20`}>
        <AuthProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto p-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
