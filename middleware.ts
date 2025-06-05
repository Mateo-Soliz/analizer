import { getSessionCookieName } from "@/utils/config.utils";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "./lib/server-only/auth/get-session-cookie";

export async function middleware(request: NextRequest) {
  const sessionCookieName = getSessionCookieName();
  const session = await getSessionCookie();

  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "http://localhost:3000"
      : request.nextUrl.origin;

  try {
    const res = await fetch(`${apiUrl}/api/login`, {
      method: "GET",
      headers: {
        Cookie: `${sessionCookieName}=${session}`,
        credentials: "include",
        Host: request.headers.get("host") || "localhost:3000",
      },
    });

    const pathname = request.nextUrl.pathname;

    if (res.status !== 200) {
      if (["/", "/login", "/register", "/analyze"].includes(pathname)) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (["/", "/login", "/register"].includes(pathname)) {
      return NextResponse.redirect(new URL("/ch/conversations", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/|favicon.ico|site.webmanifest|ingest|.well-known|login|register|analyze|checkins|\\?action=).*)",
  ],
};
