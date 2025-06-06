import { getSessionCookieName } from "@/utils/config.utils";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Sesión cerrada" });
  // Borra la cookie de sesión
  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
