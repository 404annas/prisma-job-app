import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prismaDB from "@/actions/db";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prismaDB),
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt", // 2. Using JWT strategy with Prisma is great for speed
  },
  providers: [GitHub],
  trustHost: true, // 1. Trust the host for secure cookies (since we're on localhost)
  logger: {
    error(error) {
      console.error("[auth][logger][error]", error);
    },
    warn(code) {
      console.warn("[auth][logger][warn]", code);
    },
    debug(code, metadata) {
      console.debug("[auth][logger][debug]", code, metadata);
    },
  },
  callbacks: {
    // 3. This runs when the JWT is created/updated
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    // 4. This makes the ID available in your Components/Server Actions
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
