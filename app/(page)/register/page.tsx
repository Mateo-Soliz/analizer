"use client";


import { RegisterForm } from "@/components/forms/register/register-form";
import RegisterFormContainer from "@/components/forms/register/register-form-container";
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
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const {
    signInWithGoogle,
    isLoading: isGoogleLoading,
    error: googleError,
  } = useGoogleSignIn();
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    const user = await signInWithGoogle();
    if (user) {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      router.push("/overview");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-light">Crear Cuenta</CardTitle>
          <CardDescription>Completa los datos para registrarte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleGoogleSignUp}
            variant="outline"
            className="w-full"
            disabled={isGoogleLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            Registrarse con Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O regístrate con email
              </span>
            </div>
          </div>

          <RegisterFormContainer>
            <RegisterForm />
          </RegisterFormContainer>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
