import RegisterForm from "@/components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await getServerSession();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-2">IIIT Dharwad</h1>
        <p className="text-gray-500 font-medium">Create your account to start managing notes</p>
      </div>
      <RegisterForm />
    </div>
  );
}
