"use client";
import Header from "@/components/header";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = false;

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      {children}
    </>
  );
}
