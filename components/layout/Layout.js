import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Navbar from './Navbar';

import styles from '../../styles/Layout.module.scss';

function Layout({ children }) {
  const { data: session, status } = useSession();

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
      {status === 'authenticated' && <Navbar session={session} />}
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
}

export default Layout;
