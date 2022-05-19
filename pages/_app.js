import { SessionProvider } from 'next-auth/react';
import Layout from '../components/layout/Layout';
import { UserProvider } from '../contexts/userContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.scss';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer position='top-center' autoClose={5000} limit={1} />
        </Layout>
      </UserProvider>
    </SessionProvider>
  );
}

export default MyApp;
