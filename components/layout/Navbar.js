import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Avatar from '../content/Avatar';
import useClickOutside from '../../hooks/useClickOutside';

import {
  FaHome,
  FaUserFriends,
  FaSearch,
  FaCog,
  FaUserCog,
  FaSignOutAlt,
} from 'react-icons/fa';
import styles from '../../styles/Navbar.module.scss';

function Navbar() {
  const {
    triggerRef: settingsTriggerRef,
    nodeRef: settingsNodeRef,
    show: settingsShow,
    setShow: settingsSetShow,
  } = useClickOutside(false);

  return (
    <section className={styles.navbar}>
      <Link href='/profile'>
        <a className={styles.profile}>
          <Avatar />
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
      <button className={styles.search}>
        <FaSearch />
      </button>
      <div>
        <button className={styles.settings} ref={settingsTriggerRef}>
          <FaCog />
        </button>
        {settingsShow && (
          <div className={styles.settingsMenu} ref={settingsNodeRef}>
            <Link href='/settings'>
              <a onClick={() => settingsSetShow(false)}>
                <FaUserCog /> <span>Settings</span>
              </a>
            </Link>
            <button onClick={() => signOut()}>
              <FaSignOutAlt /> <span>Log Out</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Navbar;
