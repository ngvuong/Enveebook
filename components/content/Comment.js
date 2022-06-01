import { useEffect, useState } from 'react';
import Avatar from '../ui/Avatar';
import CommentBox from './CommentBox';
import { formatDate } from '../../lib/dateFormat';

import styles from '../../styles/Comment.module.scss';
import Link from 'next/link';

function Comment({ comment, onCommentReply, size, recipient, show }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyRecipient, setReplyRecipient] = useState(
    recipient || comment.author.name
  );
  const [focus, setFocus] = useState(null);

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
      <Link href={`/profile/${comment.author._id}`}>
        <a>
          <Avatar height={size} width={size} user={comment.author} />
        </a>
      </Link>
      <div>
        <div className={styles.comment}>
          <Link href={`/profile/${comment.author._id}`}>
            <a>
              <span>{comment.author.name}</span>
            </a>
          </Link>
          <p>{comment.content}</p>
        </div>
        <div className={styles.reaction}>
          <button>Like</button>
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
