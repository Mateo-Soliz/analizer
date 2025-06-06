"use client";

import { Form } from "@/components/primitives/form";
import { useUserStore } from "@/lib/client-only/stores/user/user.store";
import { loginWithEmail } from "@/lib/firebase/actions";
import { getUser } from "@/lib/server-only/user/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña es obligatoria"),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginFormContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setUser, user: userStore } = useUserStore();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit, setError } = form;
  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      const { user, status } = await loginWithEmail(data.email, data.password);
      if (status === 200) {
        const userData = await getUser(user.uid);
        setUser(userData);
        router.push("/overview");
      } else if (
        status === "auth/user-not-found" ||
        status === "auth/wrong-password"
      ) {
        setError("root", { message: "Email o contraseña incorrectos." });
      } else {
        setError("root", {
          message: "Ha ocurrido un error. Inténtalo más tarde.",
        });
      }
    } catch (error: any) {
      setError("root", {
        message: "Ha ocurrido un error. Inténtalo más tarde.",
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </Form>
  );
}
