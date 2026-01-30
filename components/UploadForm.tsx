"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBranches, fetchSemesters, fetchSubjects, fetchSession, createBranch, createSemester, createSubject, createNote } from "@/lib/api";

export default function UploadForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("pdf");
  
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  
  const [newBranchName, setNewBranchName] = useState("");
  const [newSemesterNumber, setNewSemesterNumber] = useState("");
  
  const [isPersonal, setIsPersonal] = useState(false);
  const [error, setError] = useState("");

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
  });
  const userRole = session?.user?.role || "";

  const { data: branches = [], isLoading: branchesLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  const { data: semesters = [] } = useQuery({
    queryKey: ["semesters", selectedBranch],
    queryFn: () => fetchSemesters(selectedBranch),
    enabled: !!selectedBranch && selectedBranch !== "new",
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects", selectedSemester],
    queryFn: () => fetchSubjects(selectedSemester),
    enabled: !!selectedSemester && selectedSemester !== "new",
  });

  const createBranchMutation = useMutation({ mutationFn: createBranch });
  const createSemesterMutation = useMutation({ mutationFn: createSemester });
  const createSubjectMutation = useMutation({ mutationFn: createSubject });
  const createNoteMutation = useMutation({ mutationFn: createNote });

  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      if (selectedFile.type === "application/pdf") {
        setFileType("pdf");
      } else if (selectedFile.type.startsWith("image/")) {
        setFileType("image");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (!file) throw new Error("Please select a file to upload");
      if (!isPersonal && (!selectedBranch || !selectedSemester)) {
        throw new Error("Please select branch and semester");
      }

      let finalBranchId = selectedBranch;
      let finalSemesterId = selectedSemester;
      let finalSubjectId = selectedSubject;

      if (!isPersonal && selectedBranch === "new" && newBranchName.trim()) {
        if (userRole !== "professor" && userRole !== "cr") throw new Error("Permission denied");
        const newBranch = await createBranchMutation.mutateAsync(newBranchName.trim());
        finalBranchId = newBranch._id;
        queryClient.invalidateQueries({ queryKey: ["branches"] });
      }

      if (!isPersonal && selectedSemester === "new" && newSemesterNumber.trim() && finalBranchId) {
        if (userRole !== "professor" && userRole !== "cr") throw new Error("Permission denied");
        const newSemester = await createSemesterMutation.mutateAsync({
          number: parseInt(newSemesterNumber),
          branchId: finalBranchId,
        });
        finalSemesterId = newSemester._id;
        queryClient.invalidateQueries({ queryKey: ["semesters", finalBranchId] });
      }

      if (!isPersonal && selectedSubject === "new" && newSubjectName.trim()) {
        const newSubject = await createSubjectMutation.mutateAsync({
          name: newSubjectName.trim(),
          semesterId: finalSemesterId,
        });
        finalSubjectId = newSubject._id;
        queryClient.invalidateQueries({ queryKey: ["subjects", finalSemesterId] });
      }

      if (!isPersonal && !finalSubjectId) throw new Error("Please select or create a subject");

      const fileUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      await createNoteMutation.mutateAsync({
        title,
        fileUrl,
        fileType,
        subjectId: finalSubjectId || null,
        isPersonal,
      });

      router.push(isPersonal ? "/personal" : `/subject/${finalSubjectId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const isSubmitting = createBranchMutation.isPending || createSemesterMutation.isPending || createSubjectMutation.isPending || createNoteMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-orange-50 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">Upload New Note</h2>
      
      {branchesLoading && (
        <div className="bg-blue-50 text-blue-600 p-4 rounded-xl text-sm border border-blue-100">
          Loading branches and data...
        </div>
      )}

      {!branchesLoading && branches.length === 0 && !isPersonal && (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl text-sm border border-yellow-100">
          <p className="font-semibold mb-2">⚠️ No branches found in database</p>
          <p>Please visit <a href="/api/seed" className="underline font-bold" target="_blank">/api/seed</a> to populate the database with initial data.</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 italic">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
        <input
          type="checkbox"
          id="isPersonal"
          checked={isPersonal}
          onChange={(e) => setIsPersonal(e.target.checked)}
          className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
        />
        <label htmlFor="isPersonal" className="text-sm font-medium text-gray-700">
          Mark as Personal Note (Only visible to you)
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Note Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
          placeholder="e.g. Lecture 05: Data Structures"
          required
        />
      </div>

      {!isPersonal && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch *</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                required={!isPersonal}
              >
                <option value="">Select branch...</option>
                {branches.map((b: any) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
                {(userRole === "professor" || userRole === "cr") && (
                  <option value="new">+ Add New Branch</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                required={!isPersonal}
                disabled={!selectedBranch || selectedBranch === "new"}
              >
                <option value="">Select semester...</option>
                {semesters.map((s: any) => (
                  <option key={s._id} value={s._id}>Semester {s.number}</option>
                ))}
                {(userRole === "professor" || userRole === "cr") && selectedBranch && selectedBranch !== "new" && (
                  <option value="new">+ Add New Semester</option>
                )}
              </select>
            </div>
          </div>

          {selectedBranch === "new" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Branch Name *</label>
              <input
                type="text"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. Mechanical Engineering"
                required={selectedBranch === "new"}
              />
            </div>
          )}

          {selectedSemester === "new" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Semester Number *</label>
              <input
                type="number"
                min="1"
                max="12"
                value={newSemesterNumber}
                onChange={(e) => setNewSemesterNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. 1, 2, 3..."
                required={selectedSemester === "new"}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
              required={!isPersonal}
              disabled={!selectedSemester || selectedBranch === "new" || selectedSemester === "new"}
            >
              <option value="">Select subject...</option>
              {subjects.map((s: any) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
              <option value="new">+ Add New Subject</option>
            </select>
          </div>

          {selectedSubject === "new" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Subject Name *</label>
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. Operating Systems"
                required={selectedSubject === "new"}
              />
            </div>
          )}
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload File (PDF or Image) *</label>
        <div className="relative">
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 focus:border-orange-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
            required
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: <span className="font-medium">{file.name}</span> ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-400 italic">
          * For demo purposes. Production would use cloud storage (UploadThing/S3).
        </p>
      </div>

      <div className="pt-4 flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition transform active:scale-95 disabled:bg-gray-400"
        >
          {isSubmitting ? "Processing..." : "Publish Note"}
        </button>
      </div>
    </form>
  );
}
