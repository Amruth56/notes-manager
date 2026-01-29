import { IUser } from "@/types";

function canUploadOrganizational(user: Partial<IUser>) {
  return user.role === "cr" || user.role === "professor";
}

describe("Authorization Logic", () => {
  test("student should NOT be able to upload organizational notes", () => {
    const studentUser = { role: "student" as const };
    expect(canUploadOrganizational(studentUser)).toBe(false);
  });

  test("cr should be able to upload organizational notes", () => {
    const crUser = { role: "cr" as const };
    expect(canUploadOrganizational(crUser)).toBe(true);
  });

  test("professor should be able to upload organizational notes", () => {
    const profUser = { role: "professor" as const };
    expect(canUploadOrganizational(profUser)).toBe(true);
  });
});
