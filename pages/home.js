import { useSession } from 'next-auth/react';

import styles from '../styles/Home.module.scss';

function Home() {
  const { data: session, status } = useSession();

  console.log(session);

  return <div className={styles.home}></div>;
}

export default Home;
