import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import UserListModal from '../ui/UserListModal';
import Avatar from '../ui/Avatar';
import CommentSection from './CommentSection';
import useComments from '../../hooks/useComments';
import usePostLike from '../../hooks/usePostLike';
import useClickOutside from '../../hooks/useClickOutside';
import { formatDate } from '../../lib/dateFormat';

import { FaRegCommentAlt, FaThumbsUp, FaTrash } from 'react-icons/fa';
import styles from '../../styles/Post.module.scss';

function Post({ post, user, setFeed, setPosts }) {
  const [showCommentSection, setShowCommentSection] = useState(true);
  const [focus, setFocus] = useState(null);
  const { likes, setLike } = usePostLike(post._id, post.likes);
  const { comments } = useComments(post._id, post.comments);
  const { triggerRef, nodeRef, show, setShow } = useClickOutside(false);

  const onLike = async () => {
    const data = await fetch(`/api/posts/${post._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user._id,
      }),
    }).then((res) => res.json());

    if (data.message) {
      setLike();
    }
  };

  const onDelete = async () => {
    const data = await fetch(`/api/posts/${post._id}`, {
      method: 'DELETE',
    }).then((res) => res.json());

    if (data.message) {
      if (setFeed) {
        setFeed();
      }

      if (setPosts) {
        setPosts();
      }

      toast.success(data.message, {
        toastId: 'post_delete',
      });
    }
  };

  return (
    <article className={styles.post}>
      {show && likes.length > 0 && (
        <UserListModal
          users={likes}
          currentUser={user}
          onClose={() => setShow(false)}
          ref={nodeRef}
        />
      )}
      <section className={styles.head}>
        <Avatar height='50' width='50' user={post.author} />
        <div>
          <Link href={`/profile/${post.author._id}`}>{post.author.name}</Link>
          <p>{formatDate(post.createdAt)}</p>
        </div>
      </section>
      <p className={styles.text}>{post.content.text}</p>
      {post.content.image && (
        <div className={styles.imageContainer}>
          <Image
            src={post.content.image.url}
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
          {likes.length > 0 ? (
            <button ref={triggerRef}>
              <FaThumbsUp /> {likes.length}
            </button>
          ) : (
            <span>
              <FaThumbsUp /> {likes.length}
            </span>
          )}
          {comments.length > 0 && (
            <button onClick={() => setShowCommentSection(!showCommentSection)}>
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </button>
          )}
        </div>
        <div className={styles.reactionBtns}>
          <button
            onClick={onLike}
            className={
              likes.some((like) => like._id === user._id)
                ? styles.liked
                : undefined
            }
          >
            <FaThumbsUp /> Like
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
      <CommentSection
        comments={comments}
        postId={post._id}
        focus={focus}
        show={showCommentSection}
      />
      {user._id === post.author._id && (
        <button className={styles.btn_danger} onClick={onDelete}>
          <FaTrash />
        </button>
      )}
    </article>
  );
}

export default Post;
