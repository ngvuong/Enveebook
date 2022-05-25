import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { UserProvider } from '../contexts/userContext';
import { ToastContainer } from 'react-toastify';
import Layout from '../components/layout/Layout';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.scss';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <Layout>
          <SWRConfig
            value={{
              fetcher: (...args) => fetch(...args).then((res) => res.json()),
              errorRetryCount: 3,
            }}
          >
            <Component {...pageProps} />
          </SWRConfig>
          <ToastContainer position='top-center' autoClose={5000} limit={1} />
        </Layout>
      </UserProvider>
    </SessionProvider>
  );
}

export default MyApp;
