import Post from './Post';
import useFeed from '../../hooks/useFeed';

import { FaHeartBroken } from 'react-icons/fa';
import styles from '../../styles/Feed.module.scss';

function Feed({ user, posts }) {
  const { posts: feedPosts, isError, setFeed } = useFeed(user._id, posts);

  if (isError) {
    return (
      <p className={styles.error}>
        <FaHeartBroken /> Cannot load posts
      </p>
    );
  }

  return (
    <section className={styles.feed}>
      {feedPosts.map((post) => (
        <Post key={post._id} post={post} user={user} setFeed={setFeed} />
      ))}
    </section>
  );
}

export default Feed;
