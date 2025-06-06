"use client";
import Header from "@/components/header";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
