import Link from 'next/link';
import { toast } from 'react-toastify';
import Avatar from './Avatar';
import { useUser } from '../../contexts/userContext';

import styles from '../../styles/UserCard.module.scss';

function UserCard({
  user,
  setRequests,
  setRecommendations,
  setFriends,
  type = 'request',
}) {
  const [currentUser] = useUser();

  const mutualFriends = currentUser
    ? user.friends
        .filter((friend) => currentUser.friends.includes(friend._id))
        .map((friend) => <span key={friend._id}>{friend.name}</span>)
    : [];

  const onAccept = async () => {
    const data = await fetch(`/api/user/${user._id}/friends`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        current_user_id: currentUser._id,
        type: 'accept',
      }),
    }).then((res) => res.json());

    if (data.message) {
      toast.success(data.message, {
        toastId: 'friend_accept',
      });

      setRequests((prevRquests) =>
        prevRquests.filter((request) => request._id !== user._id)
      );
      setFriends((prevFriends) => [user, ...prevFriends]);
    }
  };

  const onRequestFriend = async () => {
    const data = await fetch(`/api/user/${user._id}/friends`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        current_user_id: currentUser._id,
        type: 'request',
      }),
    }).then((res) => res.json());

    if (data.message) {
      toast.success(data.message, {
        toastId: 'friend_request',
      });

      setRecommendations((prevRecommendations) =>
        prevRecommendations.filter((rec) => rec._id !== user._id)
      );
    }
  };

  return (
    <div className={styles.card}>
      <Avatar width='200' height='200' flexSize='100%' user={user} />
      <div className={styles.cardInfo}>
        <Link href={`/profile/${user._id}`}>{user.name}</Link>
        {mutualFriends.length > 0 ? (
          <>
            <p>
              {`${mutualFriends.length} mutual ${
                mutualFriends.length === 1 ? 'friend' : 'friends'
              }`}
            </p>
            <div className={styles.mutualFriends}>
              {mutualFriends.slice(0, 10)}{' '}
              {mutualFriends.length > 10 && (
                <span>and {mutualFriends.slice(10).length} more...</span>
              )}
            </div>
          </>
        ) : (
          <p></p>
        )}
      </div>
      {type === 'request' ? (
        <button onClick={onAccept}>Accept</button>
      ) : (
        <button onClick={onRequestFriend}>Add Friend</button>
      )}
    </div>
  );
}

export default UserCard;
