import { useSession } from 'next-auth/react';
import styles from '../../styles/Layout.module.scss';
import Navbar from './Navbar';

function Layout({ children }) {
  const { status } = useSession();

  return (
    <>
      {status === 'authenticated' && <Navbar />}
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
}

export default Layout;
