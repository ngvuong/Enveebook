import { getSession } from 'next-auth/react';
import NewPostBox from '../components/ui/NewPostBox';

import styles from '../styles/Home.module.scss';

function Home({ user }) {
  return (
    <div className={styles.home}>
      <NewPostBox user={user} />
    </div>
  );
}

export async function getServerSideProps(context) {
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
