'use server';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { z } from 'zod';

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error('The environment variable JWT_SECRET is not set. Please add it to your .env file.');
}
const key = new TextEncoder().encode(secretKey);
const COOKIE_NAME = 'session';

const sessionSchema = z.object({
  user: z.object({
    email: z.string().email(),
  }),
});

type SessionPayload = z.infer<typeof sessionSchema>;
// The full session will include JWT standard claims like exp
type Session = SessionPayload & {
    exp: number;
}


export async function createSession(email: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session: SessionPayload = { user: { email } };

  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<Session | null> {
  const cookie = cookies().get(COOKIE_NAME);
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie.value, key, {
      algorithms: ['HS256'],
    });

    // The payload from jose includes iat, exp, etc.
    const parsed = sessionSchema.safeParse(payload);
    if (!parsed.success) return null;

    return {
        ...parsed.data,
        exp: payload.exp! // exp is guaranteed by jwtVerify
    };
  } catch (error) {
    // This will catch errors like expired tokens
    return null;
  }
}

export async function deleteSession() {
  cookies().delete(COOKIE_NAME);
}
