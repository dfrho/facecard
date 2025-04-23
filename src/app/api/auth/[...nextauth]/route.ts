import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
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
      return `${baseUrl}/create-profile`;
    },
    async session({ session, token, user }) {
      console.log("Session:", session);
      console.log("Token:", token);
      console.log("User:", user);
      if (token.picture) {
        session.user.image = token.picture as string;
      }
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("JWT Token:", token);
      console.log("JWT User:", user);
      console.log("JWT Account:", account);
      console.log("JWT Profile:", profile);
      console.log("JWT isNewUser:", isNewUser);
      if (profile && profile.image) {
        token.picture = profile.image;
      }
      if (profile && profile.name) {
        token.name = profile.name;
      }
      if (profile && profile.email) {
        token.email = profile.email;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions); // Add authOptions here

export { handler as GET, handler as POST };
