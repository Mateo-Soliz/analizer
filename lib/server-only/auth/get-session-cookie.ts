import {cookies} from 'next/headers';

import {getSessionCookieName} from '@/utils/config.utils';

export const getSessionCookie = async () => {
  const sessionCookieName = getSessionCookieName();
  const cookieStore = await cookies();
  const session = cookieStore.get(`${sessionCookieName}`)?.value || null;
  return session;
};
