import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === 'hobbes') {
    const cookieStore = await cookies();
    cookieStore.set('wedding-auth', 'true', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 90, // 90 days
      path: '/',
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false });
}
