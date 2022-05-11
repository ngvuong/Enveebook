import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

import {
  FaHome,
  FaUserCircle,
  FaUserFriends,
  FaSearch,
  FaCog,
  FaUserCog,
  FaSignOutAlt,
} from 'react-icons/fa';
import styles from '../../styles/Navbar.module.scss';

function Navbar({ session }) {
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <section className={styles.navbar}>
      <Link href='/profile'>
        <a className={styles.profile}>
          {session?.user?.image ? (
            <img src={session?.user?.image} alt='Profile avatar' />
          ) : (
            <FaUserCircle />
          )}
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
        <button className={styles.settings} onClick={toggleSettings}>
          <FaCog />
        </button>
        {showSettings && (
          <div className={styles.settingsMenu}>
            <Link href='/settings'>
              <a>
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
