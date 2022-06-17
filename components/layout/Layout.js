import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import router from 'next/router';
import Head from 'next/head';
import Navbar from './Navbar';
import { useUser } from '../../contexts/userContext';

import styles from '../../styles/Layout.module.scss';

function Layout({ children, activePage }) {
  const [user, setUser] = useUser();

  useEffect(() => {
    if (!user) {
      getSession().then((session) => {
        if (!session) {
          router.replace('/');
        } else {
          setUser(session.user);
        }
      });
    }
  }, [user, setUser]);

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
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
      {user && <Navbar user={user} activePage={activePage} />}
    </>
  );
}

export default Layout;
