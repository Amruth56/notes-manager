import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";

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
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen pt-20 flex flex-col`}>
        <AuthProvider>
          <QueryProvider>
            <Navbar />
            <main className="max-w-7xl mx-auto p-6 flex-grow w-full">
              {children}
            </main>
            <Footer />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
