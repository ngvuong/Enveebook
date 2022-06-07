import { useState } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import Spinner from '../../components/layout/Spinner';
import Avatar from '../../components/ui/Avatar';
import NewPostBox from '../../components/ui/NewPostBox';
import usePosts from '../../hooks/usePosts';
import Post from '../../components/content/Post';
import User from '../../models/User';
import dbConnect from '../../lib/db';

import { FaUserCheck, FaUserPlus } from 'react-icons/fa';
import styles from '../../styles/Profile.module.scss';

function Profile({ user, currentUser }) {
  const [friendStatus, setFriendStatus] = useState(
    user.friends.find((friend) => friend._id === currentUser.id)
      ? 'friend'
      : user.friendRequests.find((request) => request._id === currentUser.id)
      ? 'requested'
      : currentUser.friendRequests.includes(user._id)
      ? 'pending'
      : 'none'
  );
  const { posts, isLoading } = usePosts(user._id);

  if (isLoading) {
    return <Spinner />;
  }

  const onRequestFriend = async (type) => {
    const data = await fetch(`/api/user/${user._id}/friends`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        current_user_id: currentUser.id,
        type,
      }),
    }).then((res) => res.json());

    if (data.message) {
      toast.success(data.message, {
        toastId: 'friend_request',
      });

      setFriendStatus('requested');
    }
  };

  const statusDisplay =
    friendStatus === 'friend' ? (
      <span className={styles.status}>
        <FaUserCheck /> Friends
      </span>
    ) : friendStatus === 'requested' ? (
      <span className={styles.status}>
        <FaUserPlus /> Requested
      </span>
    ) : friendStatus === 'pending' ? (
      <button
        className={styles.status}
        onClick={() => onRequestFriend('accept')}
      >
        <FaUserPlus /> Accept
      </button>
    ) : (
      currentUser.id !== user._id && (
        <button
          className={styles.status}
          onClick={() => onRequestFriend('request')}
        >
          <FaUserPlus /> Add Friend
        </button>
      )
    );

  return (
    <div className={styles.container}>
      <section className={styles.head}>
        <Avatar height='100' width='100' user={user} />
        <div>
          <h1>{user.name}</h1>
          <p>{user.bio}</p>
        </div>
        {statusDisplay}
      </section>
      <div className={styles.main}>
        <section className={styles.friendsSection}>
          <h3>Friends</h3>
          <hr />
          <div className={styles.friends}>
            {user.friends.map((friend) => (
              <div key={friend._id} className={styles.profile}>
                <Avatar width='40' height='40' user={friend} />
                <Link href={`/profile/${friend._id}`}>{friend.name}</Link>
              </div>
            ))}
          </div>
        </section>
        <section className={styles.postsSection}>
          {currentUser && currentUser.id === user._id && (
            <NewPostBox user={user} />
          )}
          <div className={styles.posts}>
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const { userid } = context.query;
  await dbConnect();

  const user = await User.findById(userid, { password: 0 })
    .populate('posts')
    .populate('friends', 'name image')
    .populate('friendRequests', 'name image');

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      currentUser: session.user,
      key: userid,
    },
  };
}

export default Profile;
