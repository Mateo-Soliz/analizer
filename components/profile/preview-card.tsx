"use client";
import { UserState } from "@/lib/client-only/stores/user/user.state";
import { Calendar, Edit, Mail, MapPin, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../primitives/avatar";
import { Badge } from "../primitives/badge";
import { Button } from "../primitives/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../primitives/card";
import { Separator } from "../primitives/separator";

export const PreviewCard = ({
  user,
  setEditMode,
  editMode,
}: {
  user: UserState;
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
}) => {
  return (
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
              Miembro desde:{" "}
              {user._createdAt
                ? new Date(user._createdAt).toLocaleDateString("es-ES", {
                    day: "numeric",
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
  );
};
