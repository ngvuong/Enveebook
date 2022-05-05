import Header from './Header';
import styles from '../../styles/Layout.module.scss';

function Layout({ children }) {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
}

export default Layout;
