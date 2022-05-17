import { useEffect } from 'react';
import router from 'next/router';
import Head from 'next/head';
import Navbar from './Navbar';
import { useUser } from '../../contexts/userContext';

import styles from '../../styles/Layout.module.scss';

function Layout({ children }) {
  const [user] = useUser();

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Enveebook</title>
        <meta name='description' content='A simple facebook clone' />
        <meta
          name='keywords'
          content='web development, nextjs, facebook clone, envee'
        />
      </Head>
      {user && <Navbar />}
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
}

export default Layout;
