import {cookies} from 'next/headers';

export const getCookieStore = async () => {
  return await cookies();
};
