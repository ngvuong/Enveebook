import { forwardRef } from 'react';
import Link from 'next/link';
import Avatar from './Avatar';
import Overlay from '../layout/Overlay';

import { FaThumbsUp } from 'react-icons/fa';
import styles from '../../styles/UserListModal.module.scss';

const UserListModal = forwardRef(
  ({ users, currentUser, onClose, type = 'likes' }, ref) => {
    const userList = users.map((user) => {
      const count = user.friends.reduce(
        (acc, curr) => acc + currentUser.friends.includes(curr.toString()),
        0
      );

      return (
        <div key={user._id} className={styles.profile}>
          <Avatar width='40' height='40' user={user} />
          <div>
            <Link href={`/profile/${user._id}`}>{user.name}</Link>
            {user._id !== currentUser._id && count > 0 && (
              <p>{count + ' mutual friend' + (count > 1 ? 's' : '')}</p>
            )}
          </div>
        </div>
      );
    });

    return (
      <Overlay>
        <div className={styles.container} ref={ref}>
          {type === 'likes' ? <FaThumbsUp /> : <h2>Mutual Friends</h2>}
          <hr />
          <div className={styles.list}>{userList}</div>
          <button className={styles.btn_close} onClick={onClose}>
            ✕
          </button>
        </div>
      </Overlay>
    );
  }
);

export default UserListModal;
