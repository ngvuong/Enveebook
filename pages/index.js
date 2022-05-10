import Head from 'next/head';
import Login from './auth/login';

import styles from '../styles/Welcome.module.scss';

export default function Welcome() {
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
        <h1>Welcome to Enveebook!</h1>
        <p>
          A new but familiar social networking community. Connect with old
          friends and meet new ones. Browse and share your interests and
          stories. Login or create a new account to get started.
        </p>
      </div>

      <Login />
    </div>
  );
}
