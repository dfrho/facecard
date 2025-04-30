import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";

// Define AuthOptions directly in the NextAuth call
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      issuer: 'https://www.linkedin.com/oauth',
      authorization: {
        url: 'https://www.linkedin.com/oauth/v2/authorization',
        params: { scope: 'openid profile email' },
      },
      token: 'https://www.linkedin.com/oauth/v2/accessToken',
      userinfo: 'https://api.linkedin.com/v2/userinfo',
      jwks_endpoint: 'https://www.linkedin.com/oauth/openid/jwks',
      profile(profile: any) { 
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ url, baseUrl }) {
       // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/create-profile` // Default redirect
    },
    async session({ session, token }) {
      // Ensure session.user exists before assignment
      if (!session.user) {
        // This case should theoretically not happen if a token exists,
        // but needed for type safety. Initialize with base properties.
        session.user = { name: null, email: null, image: null }; 
      }
      // Assign properties from token to session.user
      // Use combined check and 'as any' assertion for id
      if (session.user && token.sub) {
         (session.user as any).id = token.sub;
      }
      if (token.name) session.user.name = token.name; // Base type properties are fine
      if (token.email) session.user.email = token.email;
      if (token.picture) session.user.image = token.picture;
      return session;
    },
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        // Keep existing token picture if profile doesn't provide one
        // Use 'as any' assertion for profile.picture
        token.picture = (profile as any)?.picture ?? token.picture;
      }
      // Add profile info to token if available (covers LinkedIn)
      if (profile) {
         token.name = profile.name ?? token.name;
         token.email = profile.email ?? token.email;
         // Assign profile picture if available, otherwise keep existing token picture
         // Use 'as any' assertion for profile.picture
         token.picture = (profile as any)?.picture ?? token.picture;
         // Ensure 'sub' from profile is assigned if not already set by 'user.id'
         if (!token.sub && profile.sub) {
            token.sub = profile.sub;
            // If using profile.sub, ensure user.id in session gets this value
            token.id = profile.sub; 
         }
      }
      return token;
    },
  },
  // Add session strategy if needed, JWT is default
  session: {
    strategy: "jwt",
  },
  // Add secret if not already set globally
  secret: process.env.NEXTAUTH_SECRET, 
  // Add debug flag for more logs if needed
  // debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
