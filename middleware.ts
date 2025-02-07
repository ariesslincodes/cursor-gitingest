import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/',
    },
  }
);

// Protect these routes - require authentication
export const config = {
  matcher: [
    '/api/api-keys/:function*',
    '/dashboards/:path*',
    '/playground/:path*',
    '/github-summarizer/:path*',
    '/protected/:path*',
  ],
};
