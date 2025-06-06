"use client";
import { EditProfileCard, PreviewCard } from "@/components/profile";
import { useUserStore } from "@/lib/client-only/stores/user/user.store";
import { useState } from "react";

export default function ProfileSection() {
  const { user, setUser } = useUserStore();
  const [editMode, setEditMode] = useState(false);
  if (!user) {
    return <div className="text-center py-10">No hay datos de usuario.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PreviewCard user={user} setEditMode={setEditMode} editMode={editMode} />
        <EditProfileCard
          user={user}
          setUser={setUser}
          editMode={editMode}
          setEditMode={setEditMode}
        />
     
      </div>
    </div>
  );
}
