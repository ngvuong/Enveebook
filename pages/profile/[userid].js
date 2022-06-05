import Link from 'next/link';
import Spinner from '../../components/layout/Spinner';
import Avatar from '../../components/ui/Avatar';
import NewPostBox from '../../components/ui/NewPostBox';
import { useUser } from '../../contexts/userContext';
import usePosts from '../../hooks/usePosts';
import Post from '../../components/content/Post';
import User from '../../models/User';
import dbConnect from '../../lib/db';

import styles from '../../styles/Profile.module.scss';

function Profile({ user }) {
  const [currentUser] = useUser();
  const { posts, isLoading } = usePosts(user._id);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <section className={styles.head}>
        <Avatar height='150' width='150' user={user} />
        <div>
          <h1>{user.name}</h1>
          <p>{user.bio}</p>
        </div>
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
          {currentUser?.id === user._id && <NewPostBox user={user} />}
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
  const { userid } = context.query;
  await dbConnect();

  const user = await User.findById(userid, { password: 0 })
    .populate('posts')
    .populate('friends', 'name image')
    .populate('friendRequests', 'name image');

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}

export default Profile;
