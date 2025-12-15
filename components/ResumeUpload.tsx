"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { auth } from "@/firebase/client";

export default function ResumeUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      // Get the current user's ID token
      const user = auth.currentUser;
      if (!user) {
        setError("Please login to upload resume");
        toast.error("Please login to upload resume");
        return;
      }

      const idToken = await user.getIdToken();

      // Create FormData from the form element
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      
      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to upload resume");
        toast.error(data.error || "Failed to upload resume");
        return;
      }

      toast.success("Resume uploaded successfully!");
      e.currentTarget.reset();
      
      // Refresh the page to show updated resume
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error(message);
      console.error("Error uploading resume:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col gap-6 p-8 blue-gradient-dark rounded-3xl shadow-md max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-primary-100">Upload Your Resume</h3>
      <form onSubmit={handleSubmit} id="upload-form">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="file"
          name="file"
          accept=".pdf,.doc,.docx"
          className="py-2 px-3 rounded-xl border border-primary-200 text-light-800 bg-card focus:outline-none"
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="btn-call mt-4 w-full"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </form>
    </section>
  );
}
