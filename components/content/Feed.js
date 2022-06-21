import Spinner from '../layout/Spinner';
import Post from './Post';
import useFeed from '../../hooks/useFeed';

import { FaHeartBroken } from 'react-icons/fa';
import styles from '../../styles/Feed.module.scss';

function Feed({ user }) {
  const {
    posts,
    isLoading = true,
    isError,
  } = useFeed(user._id, {
    revalidateOnMount: true,
  });

  if (isError) {
    return (
      <p className={styles.error}>
        <FaHeartBroken /> Cannot load posts
      </p>
    );
  }

  return (
    <section className={styles.feed}>
      {isLoading ? (
        <Spinner />
      ) : (
        posts.map((post) => <Post key={post._id} post={post} user={user} />)
      )}
    </section>
  );
}

export default Feed;
