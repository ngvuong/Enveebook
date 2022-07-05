import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
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
      userinfo: {
        params: {
          fields: 'email,name,picture.type(large)',
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: { url: profile.picture.data.url, public_id: '' },
          friendRequests: [
            new mongoose.Types.ObjectId('62848b764e446cc081b46395'),
          ],
        };
      },
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
  pages: {
    signIn: '/',
  },
  callbacks: {
    jwt: async ({ token }) => {
      await dbConnect();
      const currentUser = await User.findById(token.sub, { password: 0 });

      if (currentUser) {
        token.user = currentUser;
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;

      return session;
    },
  },
});
