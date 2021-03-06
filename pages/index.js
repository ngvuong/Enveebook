import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import router from 'next/router';
import Head from 'next/head';
import Login from '../components/auth/Login';
import Spinner from '../components/layout/Spinner';
import Register from '../components/auth/Register';
import useClickOutside from '../hooks/useClickOutside';

import styles from '../styles/Welcome.module.scss';

export default function Welcome() {
  const [isLoading, setIsLoading] = useState(true);
  const { triggerRef, nodeRef, show, setShow } = useClickOutside(false);

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/home');
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.welcome}>
      <Head>
        <title>Enveebook</title>
        <meta name='description' content='A simple facebook clone' />
        <meta
          name='keywords'
          content='web development, nextjs, facebook clone, envee'
        />
        <link rel='icon' href='../public/favicon.ico' />
      </Head>
      <div>
        <h1>Enveebook</h1>
        <p>
          A new but familiar social networking community. Connect with old
          friends and meet new ones. Browse and share your interests and
          stories. Login or create a new account to get started.
        </p>
      </div>

      <Login ref={triggerRef} />
      {show && <Register onClose={() => setShow(false)} ref={nodeRef} />}
    </div>
  );
}
