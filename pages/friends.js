import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import SearchBar from '../components/ui/SearchBar';
import FriendList from '../components/ui/FriendList';
import UserCard from '../components/ui/UserCard';
import User from '../models/user';
import dbConnect from '../lib/db';

import { FaCaretDown } from 'react-icons/fa';
import styles from '../styles/Friends.module.scss';

function Friends({ user, allUsers, friendRecommendations, setActivePage }) {
  const [friends, setFriends] = useState(user.friends);
  const [requests, setRequests] = useState(user.friendRequests.slice(0, 10));
  const [recommendations, setRecommendations] = useState(
    friendRecommendations.slice(0, 10)
  );

  useEffect(() => {
    setActivePage('friends');
  }, [setActivePage]);

  return (
    <div className={styles.container}>
      <FriendList friends={friends} />
      <div className={styles.wrapper}>
        <SearchBar users={allUsers} />
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
            {requests.length !== user.friendRequests.length && (
              <button
                onClick={() =>
                  setRequests(
                    user.friendRequests.slice(0, requests.length + 10)
                  )
                }
              >
                See More <FaCaretDown />
              </button>
            )}
            <hr />
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
          {recommendations.length !== friendRecommendations.length && (
            <button
              onClick={() =>
                setRecommendations(
                  friendRecommendations.slice(0, recommendations.length + 10)
                )
              }
            >
              See More <FaCaretDown />
            </button>
          )}
        </section>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=600'
  );

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

  const allUsers = await User.find({}, 'name').sort({ name: 1 });

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
      allUsers: JSON.parse(JSON.stringify(allUsers)),
      friendRecommendations: JSON.parse(JSON.stringify(nonFriends)),
    },
  };
}

export default Friends;
