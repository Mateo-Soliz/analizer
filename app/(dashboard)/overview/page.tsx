"use client";
import { useUserStore } from "@/lib/client-only/stores/user/user.store";
import { useRouter } from "next/navigation";

export default function OverviewPage() {
  const router = useRouter();
  const { user } = useUserStore();
  return (
    <div>
      <h1>Overview</h1>
      {JSON.stringify(user, null, 2)}
    </div>
  );
}
