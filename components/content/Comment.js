import { useState } from 'react';
import Avatar from '../ui/Avatar';
import CommentBox from './CommentBox';
import { formatDate } from '../../lib/dateFormat';

import styles from '../../styles/Comment.module.scss';

function Comment({ comment, onCommentReply, size, recipient }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyRecipient, setReplyRecipient] = useState(
    recipient || comment.author.name
  );
  const [focus, setFocus] = useState(null);

  const onReply = (recipient) => {
    setFocus(!focus);
    console.log(replyRecipient, recipient);
    setReplyRecipient(() => {
      setShowReplyBox(true);
      return recipient;
    });
    // setShowReplyBox(true);
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
  console.log(comment, recipient);

  return (
    <div className={styles.container}>
      <Avatar height={size} width={size} user={comment.author} />
      <div>
        <div className={styles.comment}>
          <span>{comment.author.name}</span>
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
          />
        )}
      </div>
    </div>
  );
}

export default Comment;
