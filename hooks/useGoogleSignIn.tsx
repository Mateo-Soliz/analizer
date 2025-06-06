import { auth } from "@/lib/client-only/firebase-auth/firebase-config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";

export function useGoogleSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Error desconocido");
      return null;
    } finally {
      setIsLoading(false);
    }
  };


  return { signInWithGoogle, isLoading, error };
}
