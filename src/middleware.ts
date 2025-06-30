import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './lib/auth';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const isTryingToAccessApp = request.nextUrl.pathname !== '/login';

  // If user is not logged in and is trying to access a protected page
  if (!session && isTryingToAccessApp) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in and is trying to access the login page
  if (session && !isTryingToAccessApp) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
