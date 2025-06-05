import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Solo en servidor
if (typeof window !== 'undefined') {
  throw new Error('Este módulo solo puede usarse en el servidor');
}

const privateKey = Buffer.from(
  process.env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY!,
  'base64'
).toString('utf-8');

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PRIVATE_FIREBASE_PROJECT_ID!,
    clientEmail: process.env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL!,
    privateKey,
  }),
};

const firebaseAdminApp =
  getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApp();

export function getFirebaseAdminApp() {
  return firebaseAdminApp;
}

export function getFirebaseAdminAuth() {
  return getAuth(firebaseAdminApp);
}
