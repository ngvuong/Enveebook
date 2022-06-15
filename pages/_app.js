import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { UserProvider } from '../contexts/userContext';
import { ToastContainer } from 'react-toastify';
import Layout from '../components/layout/Layout';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.scss';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [activePage, setActivePage] = useState('home');

  return (
    <SessionProvider session={session}>
      <UserProvider>
        <Layout activePage={activePage}>
          <SWRConfig
            value={{
              fetcher: (...args) => fetch(...args).then((res) => res.json()),
              errorRetryCount: 3,
              revalidateOnMount: false,
            }}
          >
            <Component {...pageProps} setActivePage={setActivePage} />
          </SWRConfig>
          <ToastContainer position='top-center' autoClose={3000} limit={1} />
        </Layout>
      </UserProvider>
    </SessionProvider>
  );
}

export default MyApp;
