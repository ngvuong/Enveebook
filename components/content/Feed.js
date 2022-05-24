import Spinner from '../layout/Spinner';
import Post from './Post';
import useFeed from '../../hooks/useFeed';

import styles from '../../styles/Feed.module.scss';

function Feed({ user }) {
  const { posts, isError, isLoading, setFeed } = useFeed(user.id);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className={styles.feed}>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </section>
  );
}

export default Feed;
