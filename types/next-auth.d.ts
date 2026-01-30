import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "student" | "cr" | "professor";
    } & DefaultSession["user"];
  }

  interface User {
    role: "student" | "cr" | "professor";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "student" | "cr" | "professor";
  }
}
