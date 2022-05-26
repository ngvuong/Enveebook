import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { parseISO, format } from 'date-fns';
import Avatar from '../ui/Avatar';
import CommentSection from './CommentSection';

import { FaRegCommentAlt, FaRegThumbsUp } from 'react-icons/fa';
import styles from '../../styles/Post.module.scss';

function Post({ post, setFeed }) {
  const [showCommentSection, setShowCommentSection] = useState(true);
  const [focus, setFocus] = useState(null);

  return (
    <article className={styles.post}>
      <section className={styles.head}>
        <Link href={`/profile/${post.author._id}`}>
          <a>
            <Avatar height='50' width='50' user={post.author} />
          </a>
        </Link>

        <div>
          <Link href={`/profile/${post.author._id}`}>{post.author.name}</Link>
          <p>{format(parseISO(post.createdAt), "MMM dd, yyyy 'at' h:mm a")}</p>
        </div>
      </section>
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
          <button
            onClick={() => {
              setFocus(true);
              setShowCommentSection(!showCommentSection);
            }}
          >
            {post.comments.length}{' '}
            {post.comments.length === 1 ? 'Comment' : 'Comments'}
          </button>
        </div>
        <div className={styles.reactionBtns}>
          <button>
            <FaRegThumbsUp /> Like
          </button>
          <button
            onClick={() => {
              setShowCommentSection(true);
              setFocus(!focus);
            }}
          >
            <FaRegCommentAlt /> Comment
          </button>
        </div>
      </div>
      {showCommentSection && <CommentSection post={post} focus={focus} />}
    </article>
  );
}

export default Post;
