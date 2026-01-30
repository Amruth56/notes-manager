export const fetchSession = async () => {
  const res = await fetch("/api/auth/session");
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
};

export const fetchBranches = async () => {
  const res = await fetch("/api/branches");
  if (!res.ok) throw new Error("Failed to load branches");
  return res.json();
};

export const fetchSemesters = async (branchId: string) => {
  const res = await fetch(`/api/semesters?branchId=${branchId}`);
  if (!res.ok) throw new Error("Failed to load semesters");
  return res.json();
};

export const fetchSubjects = async (semesterId: string) => {
  const res = await fetch(`/api/subjects?semesterId=${semesterId}`);
  if (!res.ok) throw new Error("Failed to load subjects");
  return res.json();
};

export const registerUser = async (userData: any) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Something went wrong");
  }
  return res.json();
};

export const createBranch = async (name: string) => {
  const res = await fetch("/api/branches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create branch");
  return res.json();
};

export const createSemester = async (data: {
  number: number;
  branchId: string;
}) => {
  const res = await fetch("/api/semesters", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create semester");
  return res.json();
};

export const createSubject = async (data: {
  name: string;
  semesterId: string;
}) => {
  const res = await fetch("/api/subjects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create subject");
  return res.json();
};

export const createNote = async (noteData: any) => {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(noteData),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to create note");
  }
  return res.json();
};

export const updateNote = async ({
  id,
  title,
}: {
  id: string;
  title: string;
}) => {
  const res = await fetch(`/api/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
};

export const deleteNote = async (id: string) => {
  const res = await fetch(`/api/notes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete note");
  return res.json();
};

export const fetchSubject = async (id: string) => {
  const res = await fetch(`/api/subjects/${id}`);
  if (!res.ok) throw new Error("Failed to fetch subject");
  return res.json();
};

export const fetchNotes = async (params?: {
  subjectId?: string;
  isPersonal?: boolean;
}) => {
  const url = new URL("/api/notes", window.location.origin);
  if (params?.subjectId) url.searchParams.append("subjectId", params.subjectId);
  if (params?.isPersonal !== undefined)
    url.searchParams.append("isPersonal", String(params.isPersonal));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
};
