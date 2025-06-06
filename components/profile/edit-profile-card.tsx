import { UserState } from "@/lib/client-only/stores/user/user.state";
import { ProfileForm } from "../forms/profile/profile-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../primitives/card";

export const EditProfileCard = ({
  user,
  setUser,
  editMode,
  setEditMode,
}: {
  user: UserState;
  setUser: (user: UserState) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Cuenta</CardTitle>
        <CardDescription>Actualiza tu información de cuenta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProfileForm
          user={user as UserState}
          setUser={setUser}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      </CardContent>
    </Card>
  );
};
