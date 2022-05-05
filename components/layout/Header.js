import Nav from './Nav';
import Link from 'next/link';
import styles from '../../styles/Header.module.scss';

function Header() {
  return (
    <header className={styles.header}>
      <Link href='/'>
        <a href='' className={styles.title}>
          Enveebook
        </a>
      </Link>
      <Nav />
    </header>
  );
}

export default Header;
