import { db } from "@/firebase/admin";

export interface UserProfile {
  id: string;
  resumeUrl?: string;
}

export async function getUserById(userId: string): Promise<UserProfile | null> {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return null;
    const userData = userDoc.data();
    return {
      id: userDoc.id,
      resumeUrl: userData?.resumeUrl
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
