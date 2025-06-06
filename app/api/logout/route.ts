import { getSessionCookieName } from "@/utils/config.utils";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Sesión cerrada" });
  // Borra la cookie de sesión
  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    value: "",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    domain:
      process.env.NODE_ENV === "production"
        ? ".analizer-c5rg.vercel.app"
        : "localhost",
  });
  return response;
}
