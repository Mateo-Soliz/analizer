import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const {
  NEXT_PUBLIC_FIREBASE_API_KEY: apiKey,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: authDomain,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: projectId,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: storageBucket,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  NEXT_PUBLIC_FIREBASE_APP_ID: appId,
} = process.env;
const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// Initialize Firebase
let firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(firebase_app);

export default firebase_app;
