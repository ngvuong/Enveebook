import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Spinner from '../../components/layout/Spinner';
import Avatar from '../../components/ui/Avatar';
import FriendList from '../../components/ui/FriendList';
import NewPostBox from '../../components/ui/NewPostBox';
import Post from '../../components/content/Post';
import usePosts from '../../hooks/usePosts';
import User from '../../models/user';
import dbConnect from '../../lib/db';

import {
  FaUserCheck,
  FaUserPlus,
  FaHeartBroken,
  FaFacebookMessenger,
} from 'react-icons/fa';
import styles from '../../styles/Profile.module.scss';

function Profile({ user, currentUser, setActivePage }) {
  const [friends, setFriends] = useState(user.friends);
  const [friendStatus, setFriendStatus] = useState(
    user.friends.some((friend) => friend._id === currentUser._id)
      ? 'friend'
      : user.friendRequests.includes(currentUser._id)
      ? 'requested'
      : currentUser.friendRequests.includes(user._id)
      ? 'pending'
      : 'none'
  );
  const { posts, isLoading, isError } = usePosts(user._id, {
    revalidateOnMount: true,
  });

  useEffect(() => {
    setActivePage('profile');

    return () => {
      toast.dismiss();
    };
  }, [setActivePage]);

  const onRequestFriend = async (type) => {
    const data = await fetch(`/api/user/${user._id}/friends`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        current_user_id: currentUser._id,
        type,
      }),
    }).then((res) => res.json());

    if (data.message && type === 'request') {
      toast.success(data.message, {
        toastId: 'friend_request',
      });

      setFriendStatus('requested');
    } else if (data.message && type === 'accept') {
      toast.success(data.message, {
        toastId: 'friend_accept',
      });

      setFriendStatus('friend');
      setFriends([{ ...currentUser }, ...friends]);
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
      currentUser._id !== user._id && (
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
      <Head>
        <title>Profile | Enveebook</title>
      </Head>
      <section className={styles.head}>
        <div className={styles.avatarWrapper}>
          <Avatar
            height='150'
            width='150'
            flexSize='100%'
            user={user}
            link={false}
          />
        </div>
        <div className={styles.userInfo}>
          <h1>{user.name}</h1>
          <p>{user.bio}</p>
        </div>
        {statusDisplay}
        {friendStatus === 'friend' && (
          <Link href='/chat'>
            <a className={styles.message}>
              <FaFacebookMessenger /> Message
            </a>
          </Link>
        )}
      </section>
      <div className={styles.main}>
        <FriendList friends={friends} />
        <section className={styles.postsSection}>
          {currentUser._id === user._id && <NewPostBox user={user} />}
          {isError ? (
            <p className={styles.error}>
              <FaHeartBroken /> Cannot load posts
            </p>
          ) : isLoading ? (
            <Spinner />
          ) : (
            <div className={styles.posts}>
              {posts.map((post) => (
                <Post key={post._id} post={post} user={currentUser} />
              ))}
            </div>
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

  const { userid } = context.query;
  await dbConnect();

  const user = await User.findById(userid, { password: 0 }).populate(
    'friends',
    'name image'
  );

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      currentUser: session.user,
      key: userid,
    },
  };
}

export default Profile;
