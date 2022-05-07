import Link from 'next/link';

import { FaHome, FaUserCircle, FaUserFriends, FaCog } from 'react-icons/fa';
import styles from '../../styles/Navbar.module.scss';

function Navbar() {
  return (
    <section className={styles.navbar}>
      <Link href='/home'>
        <a title='Home'>
          <FaHome />
        </a>
      </Link>
      <Link href='/profile'>
        <a title='Profile'>
          <FaUserCircle />
        </a>
      </Link>
      <Link href='/friends'>
        <a title='Friends'>
          <FaUserFriends />
        </a>
      </Link>
      <Link href='/settings'>
        <a title='Settings'>
          <FaCog />
        </a>
      </Link>
    </section>
  );
}

export default Navbar;
