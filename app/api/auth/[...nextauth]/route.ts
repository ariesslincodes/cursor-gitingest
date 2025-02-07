import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { userService } from '@/app/services/user';
import type { NextAuthOptions } from 'next-auth';

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // First, the JWT callback adds the user id to the token
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // Then, the session callback adds the token's id to the session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async signIn({ user }) {
      try {
        await userService.createOrUpdateUser({
          id: user.id,
          email: user.email!,
          name: user.name,
          image: user.image,
        });
        return true;
      } catch (error) {
        console.error('Error saving user to Supabase:', error);
        return true;
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith('/')) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
  },
};

// Create the handler with the options
const handler = NextAuth(options);

// Export the handler functions for GET and POST
export { handler as GET, handler as POST };

// Export the options for use in other parts of the application
export const getAuthOptions = () => options;
