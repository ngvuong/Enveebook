import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import bcrypt from 'bcryptjs';
import User from '../../../models/user';
import dbConnect from '../../../lib/db';

export default NextAuth({
  session: {
    jwt: true,
    maxAge: 60 * 60 * 24, // 1 day
  },
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials) {
        await dbConnect();

        const { email, password } = credentials;

        if (!email) {
          throw new Error('Email is required');
        }
        if (!password) {
          throw new Error('Password is required');
        }

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('Invalid email or password');
        }
        const validCredentials = await bcrypt.compare(password, user.password);
        if (!validCredentials) {
          throw new Error('Invalid email or password');
        }

        return user;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.name = session?.user?.name
          ? session.user.name
          : token.user.username;
        session.user.image = session?.user?.image
          ? session.user.image
          : token.user.image;
      }
      return session;
    },
  },
});
