"use server";

import { headers } from "next/headers";

export const extractBearerToken = async (): Promise<string | null> => {
  const headersList = await headers();
  return headersList.get("authorization")?.split(" ")[1] || null;
};
