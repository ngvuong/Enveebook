import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Avatar from '../ui/Avatar';
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

function Navbar({ user, activePage }) {
  const {
    triggerRef: settingsTriggerRef,
    nodeRef: settingsNodeRef,
    show: settingsShow,
    setShow: settingsSetShow,
  } = useClickOutside(false);

  return (
    <section className={styles.navbar}>
      <button
        className={`${styles.profile} ${
          activePage === 'profile' ? styles.active : ''
        }`}
      >
        <Avatar height='30' width='30' user={user} />
      </button>
      <Link href='/home'>
        <a
          className={`${styles.home} ${
            activePage === 'home' ? styles.active : ''
          }`}
        >
          <FaHome />
        </a>
      </Link>
      <Link href='/friends'>
        <a
          className={`${styles.friends} ${
            activePage === 'friends' ? styles.active : ''
          }`}
        >
          <FaUserFriends />
        </a>
      </Link>
      <button
        className={`${styles.search} ${
          activePage === 'search' ? styles.active : ''
        }`}
      >
        <FaSearch />
      </button>
      <div>
        <button
          className={`${styles.settings} ${
            activePage === 'settings' ? styles.active : ''
          }`}
          ref={settingsTriggerRef}
        >
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
