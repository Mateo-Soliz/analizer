"use client";
import { Button } from "@/components/primitives/button";
import { auth } from "@/lib/client-only/firebase-auth/firebase-config";
import { signOutFirebase } from "@/lib/firebase/actions";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OverviewPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      Esta logueado:
      <br />
      {JSON.stringify(user, null, 2)}
      <Button
        onClick={async () => {
          await signOutFirebase();
          router.push("/");
        }}
      >
        Cerrar sesión
      </Button>
    </div>
  );
}
