import Head from 'next/head';
import styles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='A simple facebook clone' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
    </div>
  );
}
