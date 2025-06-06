"use client";

import { Form } from "@/components/primitives/form";
import { useUserStore } from "@/lib/client-only/stores/user/user.store";
import { registerWithEmail } from "@/lib/firebase/actions";
import { createUser } from "@/lib/server-only/user/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre es obligatorio"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
export type RegisterSchema = z.infer<typeof registerSchema>;
export default function RegisterFormContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setUser } = useUserStore();
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { handleSubmit, setError } = form;
  const onSubmit: SubmitHandler<RegisterSchema> = async (data) => {
    try {
      const { user, status } = await registerWithEmail(
        data.email,
        data.password,
        data.name
      );
      if (status === 200) {
        const userData = await createUser({
          uid: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          verified: false,
          role: "user",
        });
        setUser(userData);
        router.push("/overview");
      } else if (status === "auth/email-already-in-use") {
        setError("root", { message: "Esta cuenta ya está en uso." });
      } else {
        setError("root", {
          message: "Parece que ha ocurrido un error, inténtelo más tarde.",
        });
      }
    } catch (error: any) {
      setError("root", {
        message: "Parece que ha ocurrido un error, inténtelo más tarde.",
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </Form>
  );
}
