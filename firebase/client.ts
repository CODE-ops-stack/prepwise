// firebase/client.ts
// PrepWise (ai_mock_interviews) - Firebase Web Client Initialization

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- Firebase Config using .env.local ---
// Make sure .env.local includes all NEXT_PUBLIC_FIREBASE_* variables exactly as you have set.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional (Analytics)
};

// Prevent duplicate initialization (for Next.js SSR/CSR re-renders)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Set up Auth and Firestore using initialized app
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export app in case you need it for other Firebase services
export default app;
