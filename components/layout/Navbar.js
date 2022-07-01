import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Avatar from '../ui/Avatar';
import useClickOutside from '../../hooks/useClickOutside';

import {
  FaHome,
  FaUserFriends,
  FaCog,
  FaUserCog,
  FaSignOutAlt,
  FaFacebookMessenger,
} from 'react-icons/fa';
import styles from '../../styles/Navbar.module.scss';
import { useEffect } from 'react';

function Navbar({ user, activePage }) {
  const {
    triggerRef: navTriggerRef,
    nodeRef: navNodeRef,
    show: navShow,
    setShow: setNavShow,
  } = useClickOutside(false);
  const { triggerRef, nodeRef, show, setShow } = useClickOutside(false);

  useEffect(() => {
    console.log(navShow);
    // if (navShow) {
    setNavShow(false);
    // }
  }, [activePage]);

  return (
    <>
      <section
        className={`${styles.navbar} ${navShow ? styles.show : ''}`}
        ref={navNodeRef}
      >
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
        <Link href='/chat'>
          <a
            className={`${styles.chat} ${
              activePage === 'chat' ? styles.active : ''
            }`}
          >
            <FaFacebookMessenger />
          </a>
        </Link>
        <div className={styles.settingsWrapper}>
          <button
            className={`${styles.settings} ${
              activePage === 'settings' ? styles.active : ''
            }`}
            ref={triggerRef}
          >
            <FaCog />
          </button>
          {show && (
            <div className={styles.settingsMenu} ref={nodeRef}>
              <Link href='/settings'>
                <a onClick={() => setShow(false)}>
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
      <div className={styles.trigger} ref={navTriggerRef}></div>
    </>
  );
}

export default Navbar;
