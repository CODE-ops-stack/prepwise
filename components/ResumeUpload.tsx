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

      const user = auth.currentUser;
      if (!user) {
        setError("Please login to upload resume");
        toast.error("Please login to upload resume");
        return;
      }

      const idToken = await user.getIdToken();

      const formElement = e.currentTarget as HTMLFormElement;
      const formData = new FormData(formElement);

      console.log(" Uploading resume for user:", user.uid);
      console.log(" FormData entries:", Array.from(formData.entries()));

      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = (data as any)?.error || `Server error: ${response.status}`;
        console.error(" Upload failed:", errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      console.log(" Resume uploaded successfully:", (data as any).url);
      toast.success("Resume uploaded successfully!");
      formElement.reset();

      setTimeout(() => {
        router.refresh();
        console.log(" Page refreshed");
      }, 1000);

    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      console.error(" Error uploading resume:", err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col gap-6 p-8 blue-gradient-dark rounded-3xl shadow-md max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-primary-100">Upload Your Resume</h3>
      <form onSubmit={handleSubmit} id="upload-form">
        {error && <p className="text-red-500 text-sm"> {error}</p>}
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
