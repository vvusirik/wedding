import { NextResponse } from 'next/server';
import { lookup } from '../../../lib/guests';

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  let firstName = '', lastName = '', password = '';

  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    firstName = (formData.get('firstName') as string)?.trim() ?? '';
    lastName = (formData.get('lastName') as string)?.trim() ?? '';
    password = (formData.get('password') as string) ?? '';
  } else {
    const body = await request.json();
    firstName = body.firstName?.trim() ?? '';
    lastName = body.lastName?.trim() ?? '';
    password = body.password ?? '';
  }

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') ?? 'http';
  const origin = `${proto}://${host}`;

  if (password === 'hobbes') {
    const tags = lookup(firstName, lastName);
    if (tags !== null) {
      const maxAge = 60 * 60 * 24 * 90;
      const response = NextResponse.redirect(`${origin}/`, { status: 303 });
      response.cookies.set('wedding-auth', 'true', {
        httpOnly: true,
        sameSite: 'lax',
        maxAge,
        path: '/',
      });
      response.cookies.set('wedding-guest', JSON.stringify({ firstName, lastName, tags }), {
        httpOnly: true,
        sameSite: 'lax',
        maxAge,
        path: '/',
      });
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=1`, { status: 303 });
}
