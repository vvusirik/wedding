import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths matching /rsvp/<slug> are public — the slug is the credential
// (allows invitation links to work without the wedding-auth cookie).
const PUBLIC_RSVP_RE = /^\/rsvp\/[^/]+$/;

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuthenticated = request.cookies.get('wedding-auth')?.value === 'true';
  const isLoginPage = pathname === '/login';

  if (PUBLIC_RSVP_RE.test(pathname)) {
    return NextResponse.next();
  }

  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)'],
};
