import Image from 'next/image';
import Link from 'next/link';
import { parseISO, format } from 'date-fns';
import Avatar from '../ui/Avatar';

import styles from '../../styles/Post.module.scss';

function Post({ post }) {
  return (
    <article className={styles.post}>
      <div className={styles.head}>
        <Link href={`/profile/${post.author._id}`}>
          <a>
            <Avatar height='50' width='50' user={post.author} />
          </a>
        </Link>

        <div>
          <Link href={`/profile/${post.author._id}`}>{post.author.name}</Link>
          <p>{format(parseISO(post.createdAt), "MMM dd, yyyy 'at' h:mm a")}</p>
        </div>
      </div>
      <p className={styles.text}>{post.content.text}</p>
      {post.content.image && (
        <div className={styles.imageContainer}>
          <Image
            src={post.content.image}
            width='500'
            height='400'
            layout='responsive'
            quality={100}
            alt='Post image'
          />
        </div>
      )}
      <div className={styles.reaction}>
        <div className={styles.reactionHead}>
          <span>{post.likes.length}</span>
          <button>{post.comments.length} Comments</button>
        </div>
        <div className={styles.reactionBtns}>
          <button>Like</button>
          <button>Comment</button>
        </div>
      </div>
    </article>
  );
}

export default Post;
