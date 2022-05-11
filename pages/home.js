import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import NewPostBox from '../components/content/NewPostBox';

import styles from '../styles/Home.module.scss';

function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session);

  useEffect(() => {
    if (!session) {
      router.replace('/');
    }
  }, []);

  return (
    <div className={styles.home}>
      {session && <NewPostBox session={session} />}
    </div>
  );
}

export default Home;
