"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function UploadForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("pdf");
  
  // Hierarchical selection
  const [branches, setBranches] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  
  // New fields for adding branches and semesters
  const [newBranchName, setNewBranchName] = useState("");
  const [newSemesterNumber, setNewSemesterNumber] = useState("");
  
  const [isPersonal, setIsPersonal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");

  // Load user session and role
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (session?.user) {
          setUserRole(session.user.role || "");
        }
      })
      .catch((err) => console.error("Error loading session:", err));
  }, []);

  // Load branches on mount
  useEffect(() => {
    setDataLoading(true);
    fetch("/api/branches")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load branches");
        return res.json();
      })
      .then((data) => {
        console.log("Branches loaded:", data);
        setBranches(data);
      })
      .catch((err) => {
        console.error("Error loading branches:", err);
        setError("Failed to load branches. Please refresh the page.");
      })
      .finally(() => setDataLoading(false));
  }, []);

  // Load semesters when branch is selected
  useEffect(() => {
    if (selectedBranch) {
      fetch(`/api/semesters?branchId=${selectedBranch}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load semesters");
          return res.json();
        })
        .then((data) => {
          console.log("Semesters loaded:", data);
          setSemesters(data);
          setSelectedSemester("");
          setSubjects([]);
          setSelectedSubject("");
        })
        .catch((err) => {
          console.error("Error loading semesters:", err);
          setError("Failed to load semesters.");
        });
    }
  }, [selectedBranch]);

  // Load subjects when semester is selected
  useEffect(() => {
    if (selectedSemester) {
      fetch(`/api/subjects?semesterId=${selectedSemester}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load subjects");
          return res.json();
        })
        .then((data) => {
          console.log("Subjects loaded:", data);
          setSubjects(data);
          setSelectedSubject("");
        })
        .catch((err) => {
          console.error("Error loading subjects:", err);
          setError("Failed to load subjects.");
        });
    }
  }, [selectedSemester]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-detect file type
      if (selectedFile.type === "application/pdf") {
        setFileType("pdf");
      } else if (selectedFile.type.startsWith("image/")) {
        setFileType("image");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate
      if (!file) {
        throw new Error("Please select a file to upload");
      }

      if (!isPersonal && (!selectedBranch || !selectedSemester)) {
        throw new Error("Please select branch and semester");
      }

      let finalBranchId = selectedBranch;
      let finalSemesterId = selectedSemester;
      let finalSubjectId = selectedSubject;

      // Create new branch if needed (only for professors and CRs)
      if (!isPersonal && selectedBranch === "new" && newBranchName.trim()) {
        if (userRole !== "professor" && userRole !== "cr") {
          throw new Error("Only professors and CRs can create new branches");
        }
        
        const branchRes = await fetch("/api/branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newBranchName.trim() }),
        });

        if (!branchRes.ok) throw new Error("Failed to create branch");
        const newBranch = await branchRes.json();
        finalBranchId = newBranch._id;
        
        // Refresh branches list
        const updatedBranches = await fetch("/api/branches").then(r => r.json());
        setBranches(updatedBranches);
      }

      // Create new semester if needed (only for professors and CRs)
      if (!isPersonal && selectedSemester === "new" && newSemesterNumber.trim() && finalBranchId) {
        if (userRole !== "professor" && userRole !== "cr") {
          throw new Error("Only professors and CRs can create new semesters");
        }
        
        const semesterRes = await fetch("/api/semesters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            number: parseInt(newSemesterNumber),
            branchId: finalBranchId,
          }),
        });

        if (!semesterRes.ok) throw new Error("Failed to create semester");
        const newSemester = await semesterRes.json();
        finalSemesterId = newSemester._id;
        
        // Refresh semesters list
        const updatedSemesters = await fetch(`/api/semesters?branchId=${finalBranchId}`).then(r => r.json());
        setSemesters(updatedSemesters);
      }

      // Create new subject if needed
      if (!isPersonal && selectedSubject === "new" && newSubjectName.trim()) {
        const subjectRes = await fetch("/api/subjects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newSubjectName.trim(),
            semesterId: finalSemesterId,
          }),
        });

        if (!subjectRes.ok) throw new Error("Failed to create subject");
        const newSubject = await subjectRes.json();
        finalSubjectId = newSubject._id;
      }

      if (!isPersonal && !finalSubjectId) {
        throw new Error("Please select or create a subject");
      }

      // Upload file (simplified - in production use UploadThing/S3)
      setUploading(true);
      
      // Convert to base64 for persistent storage (demo only)
      const fileUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      
      // Create note
      const noteRes = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          fileUrl, // In production, this would be the cloud URL
          fileType,
          subjectId: finalSubjectId || null,
          isPersonal,
        }),
      });

      if (!noteRes.ok) {
        const data = await noteRes.json();
        throw new Error(data.error || "Failed to create note");
      }

      router.push(isPersonal ? "/personal" : `/subject/${finalSubjectId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-orange-50 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">Upload New Note</h2>
      
      {dataLoading && (
        <div className="bg-blue-50 text-blue-600 p-4 rounded-xl text-sm border border-blue-100">
          Loading branches and data...
        </div>
      )}

      {!dataLoading && branches.length === 0 && !isPersonal && (
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

      {/* Personal Note Toggle */}
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

      {/* Note Title */}
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

      {/* Hierarchical Selection - Only for Organizational Notes */}
      {!isPersonal && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Branch Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch *</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                required={!isPersonal}
              >
                <option value="">Select branch...</option>
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
                {(userRole === "professor" || userRole === "cr") && (
                  <option value="new">+ Add New Branch</option>
                )}
              </select>
            </div>

            {/* Semester Selection */}
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
                {semesters.map((s) => (
                  <option key={s._id} value={s._id}>Semester {s.number}</option>
                ))}
                {(userRole === "professor" || userRole === "cr") && selectedBranch && selectedBranch !== "new" && (
                  <option value="new">+ Add New Semester</option>
                )}
              </select>
            </div>
          </div>

          {/* New Branch Name Input */}
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

          {/* New Semester Number Input */}
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

          {/* Subject Selection */}
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
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
              <option value="new">+ Add New Subject</option>
            </select>
          </div>

          {/* New Subject Name */}
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

      {/* File Upload */}
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

      {/* Submit Buttons */}
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
          disabled={loading || uploading}
          className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition transform active:scale-95 disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : loading ? "Publishing..." : "Publish Note"}
        </button>
      </div>
    </form>
  );
}
