"use client";
import { Button } from "@/components/primitives/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/primitives/form";
import { Input } from "@/components/primitives/input";
import { Separator } from "@/components/primitives/separator";
import { UserState } from "@/lib/client-only/stores/user/user.state";
import { updateUser } from "@/lib/server-only/user/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido"),
  phone: z.string().optional(),
  location: z.string().optional(),
});

export function ProfileForm({
  user,
  setUser,
  editMode,
  setEditMode,
}: {
  user: UserState;
  setUser: (user: UserState) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}) {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
    });
  }, [user, form, editMode]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    const updatedUser = await updateUser(user.uid, {
      ...values,
      verified: user.verified,
      role: user.role,
      uid: user.uid,
    });
    setUser(updatedUser);
    setEditMode(false);
  };
  const { isSubmitting, isDirty, isValid } = form.formState;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete="off"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input {...field} disabled={!editMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input {...field} type="email" disabled={!editMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="phone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input {...field} disabled={!editMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="location"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input {...field} disabled={!editMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <div className="space-y-3">
          <Button
            className="w-full"
            type="submit"
            disabled={!editMode || isSubmitting || !isDirty || !isValid}
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            type="button"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancelar" : "Editar"} <Edit className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
