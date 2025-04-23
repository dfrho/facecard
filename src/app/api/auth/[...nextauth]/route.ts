import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);
      console.log("Email:", email);
      console.log("Credentials:", credentials);
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect URL:", url);
      console.log("Base URL:", baseUrl);
      return baseUrl;
    },
    async session({ session, token, user }) {
      console.log("Session:", session);
      console.log("Token:", token);
      console.log("User:", user);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("JWT Token:", token);
      console.log("JWT User:", user);
      console.log("JWT Account:", account);
      console.log("JWT Profile:", profile);
      console.log("JWT isNewUser:", isNewUser);
      return token;
    },
  },
});

export { handler as GET, handler as POST };
