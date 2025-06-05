export const getSessionCookieName = (): string => {
  return process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME as string;
};

export const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL as string;
};
