import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '@/lib/api/api';
import { parse } from 'cookie';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  let isAuthenticated = Boolean(accessToken);

  if (accessToken === undefined && refreshToken) {
    try {
      const sessionResponse = await api.get('/auth/session', {
        headers: { Cookie: cookieStore.toString() },
      });

      if (sessionResponse.status === 200) {
        isAuthenticated = true;

        const setCookie = sessionResponse.headers['set-cookie'];
        if (setCookie) {
          const response = NextResponse.next();
          const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);
            if (parsed.accessToken) {
              response.cookies.set('accessToken', parsed.accessToken, {
                expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                path: parsed.Path,
                maxAge: Number(parsed['Max-Age']),
              });
            }
            if (parsed.refreshToken) {
              response.cookies.set('refreshToken', parsed.refreshToken, {
                expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                path: parsed.Path,
                maxAge: Number(parsed['Max-Age']),
              });
            }
          }

          const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
          const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

          if (isAuthRoute && isAuthenticated) {
            const redirectResponse = NextResponse.redirect(new URL('/profile', request.url));
            for (const cookieStr of cookieArray) {
              const parsed = parse(cookieStr);
              if (parsed.accessToken) {
                redirectResponse.cookies.set('accessToken', parsed.accessToken, {
                  expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                  path: parsed.Path,
                  maxAge: Number(parsed['Max-Age']),
                });
              }
              if (parsed.refreshToken) {
                redirectResponse.cookies.set('refreshToken', parsed.refreshToken, {
                  expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                  path: parsed.Path,
                  maxAge: Number(parsed['Max-Age']),
                });
              }
            }
            return redirectResponse;
          }

          if (isPrivateRoute === false || isAuthenticated) {
            return response;
          }
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateRoute && isAuthenticated === false) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
