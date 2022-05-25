import Spinner from '../layout/Spinner';
import Post from './Post';
import useFeed from '../../hooks/useFeed';

import styles from '../../styles/Feed.module.scss';

function Feed({ user }) {
  const { posts, isError, isLoading, setFeed } = useFeed(user.id);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <p>Cannot load posts</p>;
  }

  return (
    <section className={styles.feed}>
      {posts.map((post) => (
        <Post key={post._id} post={post} setFeed={setFeed} />
      ))}
    </section>
  );
}

export default Feed;
