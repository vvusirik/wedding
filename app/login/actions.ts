'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const password = formData.get('password');

  if (password === 'hobbes') {
    const cookieStore = await cookies();
    cookieStore.set('wedding-auth', 'true', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 90, // 90 days
      path: '/',
    });
    redirect('/');
  } else {
    redirect('/login?error=1');
  }
}
