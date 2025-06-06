"use client";
import { ProfileForm } from "@/components/forms/profile/profile-form";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Separator } from "@/components/primitives/separator";
import { useUserStore } from "@/lib/client-only/stores/user/user.store";
import { Calendar, Edit, Mail, MapPin, Phone } from "lucide-react";
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.avatar || "/placeholder.svg?height=32&width=32"}
                  alt="Usuario"
                />
                <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              Información Personal
            </CardTitle>
            <CardDescription>Tu información básica de perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user.avatar || "/placeholder.svg?height=96&width=96"}
                  alt="Usuario"
                />
                <AvatarFallback className="text-2xl">
                  {user.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.phone || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.location || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Miembro desde{" "}
                  {user._createdAt
                    ? new Date(user._createdAt).toLocaleDateString("es-ES", {
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2">
              {user.role === "admin" && <Badge variant="secondary">Admin</Badge>}
              {user.verified && <Badge variant="outline">Verificado</Badge>}
            </div>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => setEditMode(true)}
              disabled={editMode}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración de Cuenta</CardTitle>
            <CardDescription>
              Actualiza tu información de cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProfileForm
              user={user}
              setUser={setUser}
              editMode={editMode}
              setEditMode={setEditMode}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
