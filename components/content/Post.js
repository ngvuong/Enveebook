import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import UserListModal from '../ui/UserListModal';
import Avatar from '../ui/Avatar';
import CommentSection from './CommentSection';
import useComments from '../../hooks/useComments';
import { useUser } from '../../contexts/userContext';
import useFeed from '../../hooks/useFeed';
import usePosts from '../../hooks/usePosts';
import useClickOutside from '../../hooks/useClickOutside';
import { formatDate } from '../../lib/dateFormat';

import { FaRegCommentAlt, FaThumbsUp, FaTrash } from 'react-icons/fa';
import styles from '../../styles/Post.module.scss';

function Post({ post }) {
  const [showCommentSection, setShowCommentSection] = useState(true);
  const [focus, setFocus] = useState(null);
  const [postComments, setPostComments] = useState(post.comments);
  const [postLikes, setPostLikes] = useState(post.likes);
  const { comments } = useComments(post._id);
  const [user] = useUser();
  const { setFeed } = useFeed(user?._id);
  const { setPosts } = usePosts(user?._id);
  const { triggerRef, nodeRef, show, setShow } = useClickOutside(false);

  useEffect(() => {
    if (comments) {
      setPostComments(comments);
    }
  }, [comments]);

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
      setPostLikes((prevLikes) => {
        if (prevLikes.some((like) => like._id === user._id)) {
          return prevLikes.filter((like) => like._id !== user._id);
        } else {
          return [user, ...prevLikes];
        }
      });
    }
  };

  const onDelete = async () => {
    const data = await fetch(`/api/posts/${post._id}`, {
      method: 'DELETE',
    }).then((res) => res.json());

    if (data.message) {
      setFeed();
      setPosts();

      toast.success(data.message, {
        toastId: 'post_delete',
      });
    }
  };

  return (
    <article className={styles.post}>
      {show && postLikes.length > 0 && (
        <UserListModal
          users={postLikes}
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
          <button ref={triggerRef}>
            <FaThumbsUp /> {postLikes.length}
          </button>
          {postComments.length > 0 && (
            <button onClick={() => setShowCommentSection(!showCommentSection)}>
              {postComments.length}{' '}
              {postComments.length === 1 ? 'Comment' : 'Comments'}
            </button>
          )}
        </div>
        <div className={styles.reactionBtns}>
          <button
            onClick={onLike}
            className={
              postLikes.find((like) => like._id === user?._id)
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
        comments={postComments}
        postId={post._id}
        focus={focus}
        show={showCommentSection}
      />
      {user?._id === post.author._id && (
        <button className={styles.btn_danger} onClick={onDelete}>
          <FaTrash />
        </button>
      )}
    </article>
  );
}

export default Post;
