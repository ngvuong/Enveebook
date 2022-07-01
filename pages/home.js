import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import Feed from '../components/content/Feed';
import NewPostBox from '../components/ui/NewPostBox';

import styles from '../styles/Home.module.scss';

function Home({ user, setActivePage }) {
  useEffect(() => {
    setActivePage('home');
  }, [setActivePage]);

  return (
    <div className={styles.home}>
      <NewPostBox user={user} />
      <Feed user={user} />
    </div>
  );
}

export async function getServerSideProps(context) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=600'
  );

  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
}

export default Home;
