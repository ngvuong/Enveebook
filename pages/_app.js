import { SessionProvider } from 'next-auth/react';
import Layout from '../components/layout/Layout';
import { UserProvider } from '../contexts/userContext';
import '../styles/globals.scss';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </SessionProvider>
  );
}

export default MyApp;
