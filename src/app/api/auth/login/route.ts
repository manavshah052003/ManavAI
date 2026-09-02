import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'manav@gmail.com';
const ADMIN_PASSWORD = 'manav@1234';
const SESSION_TOKEN = 'manav-authenticated-admin-session-2026';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set('admin_session', SESSION_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
