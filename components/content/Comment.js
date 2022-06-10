import { useEffect, useState } from 'react';
import Link from 'next/link';
import Avatar from '../ui/Avatar';
import CommentBox from './CommentBox';
import UserListModal from '../ui/UserListModal';
import useComments from '../../hooks/useComments';
import { useUser } from '../../contexts/userContext';
import useClickOutside from '../../hooks/useClickOutside';
import { formatDate } from '../../lib/dateFormat';

import { FaThumbsUp, FaTrash } from 'react-icons/fa';
import styles from '../../styles/Comment.module.scss';

function Comment({ comment, onCommentReply, size, recipient, show }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyRecipient, setReplyRecipient] = useState(
    recipient || comment.author.name
  );
  const [focus, setFocus] = useState(null);
  const [commentLikes, setCommentLikes] = useState(comment.likes);
  const { setComments } = useComments(comment.post);
  const [user] = useUser();
  const {
    triggerRef,
    nodeRef,
    show: showModal,
    setShow,
  } = useClickOutside(false);

  useEffect(() => {
    if (!show) {
      setShowReplyBox(false);
    }
  }, [show]);

  const onReply = (recipient) => {
    setFocus(!focus);
    setReplyRecipient(() => {
      setShowReplyBox(true);
      return recipient;
    });
  };

  const onLike = async () => {
    const data = await fetch(
      `/api/posts/${comment.post}/comments/${comment._id}/`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user._id,
        }),
      }
    ).then((res) => res.json());

    if (data.message) {
      setCommentLikes((prevLikes) => {
        if (prevLikes.some((like) => like._id === user._id)) {
          return prevLikes.filter((like) => like._id !== user._id);
        } else {
          return [user, ...prevLikes];
        }
      });
    }
  };

  const onDelete = async () => {
    const data = await fetch(
      `/api/posts/${comment.post}/comments/${comment._id}/`,
      {
        method: 'DELETE',
      }
    ).then((res) => res.json());

    if (data.message) {
      setComments();
    }
  };

  const replies = comment?.replies?.map((reply) => (
    <Comment
      key={reply._id}
      comment={reply}
      onCommentReply={() => onReply(reply.author.name)}
      size='24'
      recipient={reply.author.name}
    />
  ));

  return (
    <div className={styles.container}>
      {showModal && (
        <UserListModal
          users={commentLikes}
          currentUser={user}
          onClose={() => setShow(false)}
          ref={nodeRef}
        />
      )}
      <Avatar height={size} width={size} user={comment.author} />
      <div>
        <div className={styles.comment}>
          <Link href={`/profile/${comment.author._id}`}>
            {comment.author.name}
          </Link>
          <p>{comment.content}</p>
          {commentLikes.length > 0 && (
            <button ref={triggerRef}>
              <FaThumbsUp /> {commentLikes.length > 1 && commentLikes.length}
            </button>
          )}
        </div>
        <div className={styles.reaction}>
          <button
            onClick={onLike}
            className={
              commentLikes.some((like) => like._id === user?._id)
                ? styles.liked
                : undefined
            }
          >
            Like
          </button>
          {comment.type === 'comment' ? (
            <button onClick={() => onReply(comment.author.name)}>Reply</button>
          ) : (
            <button onClick={onCommentReply}>Reply</button>
          )}

          <span>{formatDate(comment.createdAt, 'short')}</span>
        </div>
        {replies}
        {showReplyBox && comment.type === 'comment' && (
          <CommentBox
            postId={comment.post}
            commentId={comment._id}
            focus={focus}
            size='24'
            recipient={replyRecipient}
            setShowReplyBox={setShowReplyBox}
          />
        )}
      </div>
      {user?._id === comment.author._id && (
        <button className={styles.btn_danger} onClick={onDelete}>
          <FaTrash />
        </button>
      )}
    </div>
  );
}

export default Comment;
