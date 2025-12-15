"use server"

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import app from "@/firebase/client";
import { getCurrentUser } from "./auth.action";

export async function uploadResume(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const file = formData.get('file') as File;
    if (!file) throw new Error("No file provided");

    const storage = getStorage(app);
    const db = getFirestore(app);
    
    // Create a storage reference
    const storageRef = ref(storage, `resumes/${user.id}/${file.name}`);
    
    // Convert File to Blob since we're in a browser environment
    const fileBlob = new Blob([await file.arrayBuffer()], { type: file.type });
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, fileBlob);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    // Update user document with resume URL
    await updateDoc(doc(db, 'users', user.id), {
      resumeUrl: downloadUrl
    });

    return { success: true, url: downloadUrl };
  } catch (error) {
    console.error("Error uploading resume:", error);
    throw new Error("Failed to upload resume");
  }
}
