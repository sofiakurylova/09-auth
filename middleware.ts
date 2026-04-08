import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  const isPrivatePage = pathname.startsWith('/profile') || pathname.startsWith('/notes');
  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  if (isPrivatePage && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
