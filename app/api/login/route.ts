import { NextRequest, NextResponse } from "next/server";

import { getFirebaseAdminAuth } from "@/lib/server-only/firebase-admin/firebase-admin";
import { getCookieStore } from "@/lib/server-only/utils/cookies.utils";
import { extractBearerToken } from "@/lib/server-only/utils/headers.utils";
import { getSessionCookieName } from "@/utils/config.utils";

export const runtime = "nodejs";

const sessionCookieName = getSessionCookieName();

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get(sessionCookieName)?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: "No session cookie" }, { status: 401 });
  }

  try {
    await getFirebaseAdminAuth().verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}

export const POST = async () => {
  const idToken = await extractBearerToken();
  if (idToken) {
    const cookieStore = await getCookieStore();
    const decodedToken = await getFirebaseAdminAuth().verifyIdToken(idToken);

    if (decodedToken) {
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await getFirebaseAdminAuth().createSessionCookie(
        idToken,
        {
          expiresIn,
        }
      );

      const isProduction = process.env.NODE_ENV === "production";
      const options = {
        name: sessionCookieName,
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
        domain: isProduction ? ".analizer-fp.com" : "localhost",
      };

      cookieStore.set(options);
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      const options = {
        name: sessionCookieName,
        value: "",
        maxAge: -1,
      };
      cookieStore.set(options);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
};
