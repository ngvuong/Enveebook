import Link from 'next/link';
import styles from '../../styles/Nav.module.scss';

function Nav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link href='/auth/login'>Login</Link>
        </li>
        <li>
          <Link href='/auth/register'>Signup</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
