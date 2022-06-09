import Link from 'next/link';
import Avatar from './Avatar';

import styles from '../../styles/FriendList.module.scss';

function FriendList({ friends }) {
  return (
    <section className={styles.container}>
      <h3>Friends</h3>
      <hr />
      <div className={styles.friends}>
        {friends.map((friend) => (
          <div key={friend._id} className={styles.profile}>
            <Avatar width='40' height='40' user={friend} />
            <Link href={`/profile/${friend._id}`}>{friend.name}</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FriendList;
