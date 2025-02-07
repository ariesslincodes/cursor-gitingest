import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Middleware for protected routes
export default withAuth(
  function middleware(request: NextRequest) {
    // Add token debugging for all protected routes
    getToken({ req: request }).then((token) => {
      console.log('JWT Token Debug:', {
        exists: !!token,
        id: token?.id,
        email: token?.email,
        sub: token?.sub,
        path: request.nextUrl.pathname,
        timestamp: new Date().toISOString(),
      });
    });

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log('Authorization check:', {
          hasToken: !!token,
          timestamp: new Date().toISOString(),
        });
        return !!token;
      },
    },
    pages: {
      signIn: '/',
    },
  }
);

// Combined matcher configuration for all protected routes
export const config = {
  matcher: [
    '/api/api-keys/:path*',
    '/dashboards/:path*',
    '/playground/:path*',
    '/github-summarizer/:path*',
    '/protected/:path*',
  ],
};
