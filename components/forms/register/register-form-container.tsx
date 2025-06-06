"use client";

import { Form } from "@/components/primitives/form";
import { registerWithEmail } from "@/lib/firebase/actions";
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
      const status = await registerWithEmail(
        data.email,
        data.password,
        data.name
      );
      if (status === 200) {
        router.push("/overview");
      } else if (status === "auth/email-already-in-use") {
        setError("root", { message: "Esta cuenta ya está en uso." });
      } else {
        setError("root", { message: "Parece que ha ocurrido un error, inténtelo más tarde." });
      }
    } catch (error: any) {
      setError("root", { message: "Parece que ha ocurrido un error, inténtelo más tarde." });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </Form>
  );
}
