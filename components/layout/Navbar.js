import Link from 'next/link';

import {
  FaHome,
  FaUserCircle,
  FaUserFriends,
  FaSearch,
  FaCog,
} from 'react-icons/fa';
import styles from '../../styles/Navbar.module.scss';

function Navbar() {
  return (
    <section className={styles.navbar}>
      <Link href='/profile'>
        <a className={styles.profile}>
          <FaUserCircle />
        </a>
      </Link>
      <Link href='/home'>
        <a className={styles.home}>
          <FaHome />
        </a>
      </Link>
      <Link href='/friends'>
        <a className={styles.friends}>
          <FaUserFriends />
        </a>
      </Link>
      <Link href='/search'>
        <a className={styles.search}>
          <FaSearch />
        </a>
      </Link>
      <Link href='/settings'>
        <a className={styles.settings}>
          <FaCog />
        </a>
      </Link>
    </section>
  );
}

export default Navbar;
