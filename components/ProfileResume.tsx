export default function ProfileResume({ resumeUrl }: { resumeUrl?: string }) {
  return (
    <div className="flex flex-col gap-2 mt-8">
      <h3 className="text-lg font-semibold text-primary-100 mb-2">Your Uploaded Resume</h3>
      {resumeUrl ? (
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-2 bg-success-100 text-white rounded-full font-bold transition hover:bg-success-200"
        >
          Download / View Resume
        </a>
      ) : (
        <p className="text-light-100">No resume uploaded yet.</p>
      )}
    </div>
  );
}
