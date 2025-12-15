import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

// Helper to get resume keywords
async function getResumeSkills(userid: string) {
  try {
    const userDoc = await db.collection("users").doc(userid).get();
    const userData = userDoc.data();
    if (!userData?.resumeUrl) return "";

    // Placeholder for resume parsing (replace with Gemini or extractor)
    // E.g., const resumeText = await parseResumePDF(userData.resumeUrl);
    // const skillsString = extractSkillsFromText(resumeText);

    const skillsString = "React, Next.js, Firebase, TypeScript, AI/ML"; // Replace with extraction
    return skillsString;
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    // Get skills from uploaded resume, if any
    const resumeSkills = await getResumeSkills(userid);
    // Compose skills into prompt if present
    const resumeLine =
      resumeSkills.length > 0
        ? `The candidate's resume includes: ${resumeSkills}. Use these skills/technologies to personalize the interview questions.\n`
        : "";

    const prompt = `
      Prepare questions for a job interview.
      The job role is ${role}.
      The job experience level is ${level}.
      The tech stack used in the job is: ${techstack}.
      ${resumeLine}
      The focus between behavioural and technical questions should lean towards: ${type}.
      The amount of questions required is: ${amount}.
      Please return only the questions, without any additional text.
      The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
      Return the questions formatted like this:
      ["Question 1", "Question 2", "Question 3"]

      Thank you! <3
    `;

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
          