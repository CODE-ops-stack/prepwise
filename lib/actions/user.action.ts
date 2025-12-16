import { db } from "@/firebase/admin";

export interface UserProfile {
  id: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeUpdatedAt?: Date;
}

export async function getUserById(userId: string): Promise<UserProfile | null> {
  try {
    console.log("🔍 Fetching user profile:", userId);
    
    const userDoc = await db.collection("users").doc(userId).get();
    
    if (!userDoc.exists) {
      console.warn(" User document not found:", userId);
      return null;
    }

    const userData = userDoc.data();
    console.log(" User data from Firestore:", userData);

    const userProfile: UserProfile = {
      id: userDoc.id,
      resumeUrl: userData?.resumeUrl,
      resumeFileName: userData?.resumeFileName,
      resumeUpdatedAt: userData?.resumeUpdatedAt?.toDate(),
    };

    console.log("✅ Returning user profile:", userProfile);
    return userProfile;

  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return null;
  }
}
