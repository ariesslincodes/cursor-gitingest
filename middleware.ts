import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/',
    error: '/',
  },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    '/playground',
    '/dashboards',
    '/github-summarizer',
    '/protected',
    '/api/validate-key',
    '/api/github-summarizer',
  ],
};
