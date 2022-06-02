import { forwardRef } from 'react';
import Link from 'next/link';
import Avatar from './Avatar';
import Overlay from '../layout/Overlay';

import { FaThumbsUp } from 'react-icons/fa';
import styles from '../../styles/LikesModal.module.scss';

const LikesModal = forwardRef(({ users, onClose }, ref) => {
  return (
    <Overlay>
      <div className={styles.container} ref={ref}>
        <FaThumbsUp />
        <hr />
        {users.map((user) => (
          <div key={user._id} className={styles.profile}>
            <Avatar width='40' height='40' user={user} />
            <Link href={`/profile/${user._id}`}>{user.name}</Link>
          </div>
        ))}
        <button className={styles.btn_close} onClick={onClose}>
          ✕
        </button>
      </div>
    </Overlay>
  );
});

export default LikesModal;
