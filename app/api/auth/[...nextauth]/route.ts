import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { userService } from '@/services/user';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
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
        return true; // Still allow sign in even if DB save fails
      }
    },
  },
});

export { handler as GET, handler as POST };
