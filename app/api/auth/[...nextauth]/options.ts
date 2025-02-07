import GoogleProvider from 'next-auth/providers/google';
import { userService } from '@/app/services/user';
import type { NextAuthOptions } from 'next-auth';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
    accessToken?: string;
  }
  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  }
}

// Extend JWT type
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true, // Enable debug messages
  callbacks: {
    async jwt({ token, user, account, profile }) {
      console.log('JWT Callback Debug:', {
        hasUser: !!user,
        hasAccount: !!account,
        hasProfile: !!profile,
        currentToken: token,
      });

      if (user) {
        // For Google OAuth, use sub as stable identifier
        token.id = user.id || `google_${token.sub}`;
        token.email = user.email;
      }
      if (account) {
        token.accessToken = account.access_token;
      }

      console.log('JWT Token After Update:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback Debug:', {
        hasToken: !!token,
        tokenId: token.id,
        tokenEmail: token.email,
        sessionBefore: session,
      });

      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.accessToken = token.accessToken;
      }

      console.log('Session After Update:', session);
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log('SignIn Callback Debug:', {
        user,
        accountType: account?.provider,
        profileId: profile?.sub,
      });

      try {
        // Ensure we have a stable user ID
        const userId = user.id || `google_${profile?.sub}`;
        user.id = userId;

        await userService.createOrUpdateUser({
          id: userId,
          email: user.email!,
          name: user.name,
          image: user.image,
        });
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
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
