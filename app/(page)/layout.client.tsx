"use client";
import Header from "@/components/header";
import { auth } from "@/lib/client-only/firebase-auth/firebase-config";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setIsLoggedIn(user !== null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
