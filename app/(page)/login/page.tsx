"use client";

import { LoginForm } from "@/components/forms/login/login-form";
import LoginFormContainer from "@/components/forms/login/login-form-container";
import { Button } from "@/components/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Separator } from "@/components/primitives/separator";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import { useUserStore } from "@/lib/client-only/stores/user/user.store";
import { getUser } from "@/lib/server-only/user/user.service";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleSignIn();
  const router = useRouter();
  const { setUser } = useUserStore();
  const handleGoogleSignIp = async () => {
    const user = await signInWithGoogle();
    if (user) {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const userData = await getUser(user.uid);
      setUser(userData);
      router.push("/overview");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-light">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleGoogleSignIp}
            variant="outline"
            className="w-full"
            disabled={isGoogleLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            Continuar con Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O continúa con email
              </span>
            </div>
          </div>

          <LoginFormContainer>
            <LoginForm />
          </LoginFormContainer>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">¿No tienes cuenta? </span>
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
