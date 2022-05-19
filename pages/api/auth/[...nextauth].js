import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import bcrypt from 'bcryptjs';
import User from '../../../models/user';
import dbConnect from '../../../lib/db';
import { MongoDBAdapter } from '@next-auth//mongodb-adapter';
import clientPromise from '../../../lib/mongodb';

export default NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 1 day
  },
  adapter: MongoDBAdapter(clientPromise),
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
      } else {
        dbConnect();
        const user = await User.findById(token.sub);
        if (user) {
          token.user = user;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.user._id || token.user.id;
      session.user.image = token.user.image;
      session.user.bio = token.user.bio;
      if (!session.user.image.url) {
        session.user.image = {};
        session.user.image.url = token.user.image;
      }
      return session;
    },
  },
});
