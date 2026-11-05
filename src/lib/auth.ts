import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import { isAllowedAvatarUrl } from '@/lib/avatar-url';

export const authOptions: NextAuthOptions = {
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
      client: {
        token_endpoint_auth_method: 'client_secret_post',
      },
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
      // Allow relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/create-profile`;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = { name: null, email: null, image: null };
      }
      if (token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      if (token.name) session.user.name = token.name;
      if (token.email) session.user.email = token.email;
      if (token.picture) session.user.image = token.picture;
      return session;
    },
    async jwt({ token, user, account, profile, trigger, session }) {
      // Initial sign in
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.picture = (profile as any)?.picture ?? token.picture;
      }
      // Add profile info to the token when available (covers LinkedIn)
      if (profile) {
        token.name = profile.name ?? token.name;
        token.email = profile.email ?? token.email;
        token.picture = (profile as any)?.picture ?? token.picture;
        if (!token.sub && profile.sub) {
          token.sub = profile.sub;
          token.id = profile.sub;
        }
      }
      // A photo uploaded in the profile form replaces the provider's picture.
      // Only URLs this app issues are accepted, since the client sends this value.
      const uploadedImage = session?.user?.image;
      if (trigger === 'update' && isAllowedAvatarUrl(uploadedImage)) {
        token.picture = uploadedImage;
      }
      return token;
    },
  },
  pages: {
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
