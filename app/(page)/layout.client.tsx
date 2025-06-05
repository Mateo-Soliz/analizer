"use client";
import Header from "@/components/header";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = false;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
