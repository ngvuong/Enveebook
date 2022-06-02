import { useEffect, useState } from 'react';
import Link from 'next/link';
import Avatar from '../ui/Avatar';
import CommentBox from './CommentBox';
import LikesModal from '../ui/LikesModal';
import { formatDate } from '../../lib/dateFormat';
import { useUser } from '../../contexts/userContext';
import useClickOutside from '../../hooks/useClickOutside';

import { FaThumbsUp } from 'react-icons/fa';
import styles from '../../styles/Comment.module.scss';

function Comment({ comment, onCommentReply, size, recipient, show }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyRecipient, setReplyRecipient] = useState(
    recipient || comment.author.name
  );
  const [focus, setFocus] = useState(null);
  const [commentLikes, setCommentLikes] = useState(comment.likes);
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
      `/api/posts/${comment.post}/comments/${comment._id}/like`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          user_name: user.name,
          user_image: user.image,
        }),
      }
    ).then((res) => res.json());

    setCommentLikes(data.likes);
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
        <LikesModal
          users={commentLikes}
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
              commentLikes.find((like) => like._id === user?.id)
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
    </div>
  );
}

export default Comment;
