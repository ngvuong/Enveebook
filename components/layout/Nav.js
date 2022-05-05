import Link from 'next/link';
import styles from '../../styles/Nav.module.scss';

function Nav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link href='/auth/login'>Log in</Link>
        </li>
        <li>
          <Link href='/auth/register'>Sign up</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
