import UploadForm from "@/components/UploadForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function UploadPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any).role;

  return (
    <div className="">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Publish Study Material</h1>
        <p className="text-gray-500 text-lg">Help your peers by sharing quality academic resources.</p>
      </header>
      
      <UploadForm />
    </div>
  );
}
