import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../client-only/firebase-auth/firebase-config";

export const signOutFirebase = async () => {
  await signOut(auth);
  await fetch("/api/logout", {
    method: "POST",
  });
};

export const registerWithEmail = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name });
    }
    const idToken = await userCredential.user.getIdToken();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (res.status === 401) {
      await signOutFirebase();
      return null;
    }
    return { user: userCredential.user, status: res.status };
  } catch (error: any) {
    console.error(error);
    return error.code;
  }
};

export const loginWithEmail = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (res.status === 401) {
      await signOutFirebase();
      return null;
    }
    return { user: userCredential.user, status: res.status };
  } catch (error: any) {
    console.error(error);
    return error.code;
  }
};
