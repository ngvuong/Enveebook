import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import Feed from '../components/content/Feed';
import NewPostBox from '../components/ui/NewPostBox';
import Post from '../models/post';
import dbConnect from '../lib/db';

import styles from '../styles/Home.module.scss';

function Home({ user, posts, setActivePage }) {
  useEffect(() => {
    setActivePage('home');
  }, [setActivePage]);

  return (
    <div className={styles.home}>
      <NewPostBox user={user} />
      <Feed user={user} posts={posts} />
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

  const authorList = [session.user._id, ...session.user.friends];

  const posts = await Post.find({ author: { $in: authorList } })
    .populate('author', 'name image')
    .populate({
      path: 'comments',
      populate: [
        { path: 'author', select: 'name image' },
        {
          path: 'likes',
          select: 'name image friends',
        },
        {
          path: 'replies',
          populate: [
            { path: 'author', select: 'name image' },
            { path: 'likes', select: 'name image friends' },
          ],
        },
      ],
    })
    .populate('likes', 'name image friends')
    .sort({
      createdAt: -1,
    });

  return {
    props: {
      user: session.user,
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
}

export default Home;
