import { POST } from "@/app/api/branches/route";
import { getServerSession } from "next-auth";
import Branch from "@/models/Branch";
import { NextResponse } from "next/server";

jest.mock("next-auth");
jest.mock("@/lib/db", () => ({
  connectDB: jest.fn(),
}));
jest.mock("@/models/Branch");
jest.mock("@/app/api/auth/[...nextauth]/route", () => ({
  authOptions: {},
}));

describe("POST /api/branches", () => {
  it("returns 403 if user is a student", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { role: "student" },
    });

    const req = new Request("http://localhost/api/branches", {
      method: "POST",
      body: JSON.stringify({ name: "Testing Branch" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Only professors and CRs can create branches");
  });

  it("returns 201 and creates branch if user is a professor", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { role: "professor" },
    });
    (Branch.create as jest.Mock).mockResolvedValue({
      _id: "mock_id",
      name: "New Branch",
    });

    const req = new Request("http://localhost/api/branches", {
      method: "POST",
      body: JSON.stringify({ name: "New Branch" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe("New Branch");
    expect(Branch.create).toHaveBeenCalledWith({ name: "New Branch" });
  });
});
