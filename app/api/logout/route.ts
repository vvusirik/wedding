import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete('wedding-auth');
  cookieStore.delete('wedding-guest');
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/login`);
}
