import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-2">IIIT Dharwad</h1>
        <p className="text-gray-500 font-medium">Smart Notes Management Platform</p>
      </div>
      <LoginForm />
    </div>
  );
}
