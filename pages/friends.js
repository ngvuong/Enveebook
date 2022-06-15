import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import FriendList from '../components/ui/FriendList';
import UserCard from '../components/ui/UserCard';
import User from '../models/User';
import dbConnect from '../lib/db';

import styles from '../styles/Friends.module.scss';

function Friends({ user, friendRecommendations, setActivePage }) {
  const [friends, setFriends] = useState(user.friends);
  const [requests, setRequests] = useState(user.friendRequests);
  const [recommendations, setRecommendations] = useState(friendRecommendations);

  useEffect(() => {
    setActivePage('friends');
  }, []);

  return (
    <div className={styles.container}>
      <FriendList friends={friends} />
      <div className={styles.wrapper}>
        {requests.length > 0 && (
          <section className={styles.requestsSection}>
            <p>Friend Requests</p>
            <div className={styles.requests}>
              {requests.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  setRequests={setRequests}
                  setFriends={setFriends}
                />
              ))}
            </div>
          </section>
        )}
        <section className={styles.recommendationsSection}>
          <p>Friend Recommendations</p>
          <div className={styles.recommendations}>
            {recommendations.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                setRecommendations={setRecommendations}
                type='recommendation'
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  await dbConnect();

  const user = await User.findById(session.user._id, { password: 0 })
    .populate('friends', 'name image friends')
    .populate({
      path: 'friendRequests',
      select: 'name image',
      populate: { path: 'friends', select: 'name image friends' },
    });

  const getMutualFriends = (target) => {
    return user.friends.filter((uf) =>
      target.friends.some((tf) => tf._id.toString() === uf._id.toString())
    );
  };
  const sortByMutualFriends = (a, b) => {
    const aLength = getMutualFriends(a).length;
    const bLength = getMutualFriends(b).length;

    return aLength > bLength ? -1 : aLength < bLength ? 1 : 0;
  };

  const nonFriends = [
    ...(await User.find(
      {
        _id: { $ne: user._id },
        friends: { $ne: user._id },
        friendRequests: { $ne: user._id },
      },
      'friends name image'
    ).populate('friends', 'name image friends')),
  ]
    .filter(
      (u) =>
        !user.friendRequests.some((r) => r._id.toString() === u._id.toString())
    )
    .sort(sortByMutualFriends);

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      friendRecommendations: JSON.parse(
        JSON.stringify(nonFriends.slice(0, 10))
      ),
    },
  };
}

export default Friends;
