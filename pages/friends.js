import { getSession } from 'next-auth/react';
import UserCard from '../components/ui/UserCard';
import User from '../models/User';
import dbConnect from '../lib/db';

import styles from '../styles/Friends.module.scss';

function Friends({ user }) {
  console.log(user);
  return (
    <div className={styles.container}>
      <h2>Friend Requests</h2>
      <section className={styles.requests}>
        {user.friendRequests.map((user) => (
          <UserCard user={user} />
        ))}
      </section>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  await dbConnect();

  const user = await User.findById(session.user.id, { password: 0 })
    .populate('friends', 'name image')
    .populate('friendRequests', 'name image');

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}

export default Friends;
