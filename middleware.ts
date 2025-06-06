import { getSessionCookieName } from "@/utils/config.utils";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "./lib/server-only/auth/get-session-cookie";

export async function middleware(request: NextRequest) {
  const sessionCookieName = getSessionCookieName();
  const session = await getSessionCookie();

  const apiUrl = request.nextUrl.origin;

  const pathname = request.nextUrl.pathname;

  try {
    const res = await fetch(`${apiUrl}/api/login`, {
      method: "GET",
      headers: {
        Cookie: `${sessionCookieName}=${session}`,
        credentials: "include",
        Host: request.headers.get("host") || "localhost:3000",
      },
    });

    const isAuthenticated = res.status === 200;

    if (isAuthenticated && ["/login", "/register", "/"].includes(pathname)) {
      return NextResponse.redirect(new URL("/overview", request.url));
    }

    const publicRoutes = ["/", "/login", "/register", "/analyze"];
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log("error", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/|favicon.ico|site.webmanifest|ingest|login|register|analyze|checkins|\\?action=).*)",
  ],
};
