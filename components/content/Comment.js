import { useState } from 'react';
import Avatar from '../ui/Avatar';
import CommentBox from './CommentBox';
import { formatDate } from '../../lib/dateFormat';

import styles from '../../styles/Comment.module.scss';

function Comment({ comment, onCommentReply, size }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [focus, setFocus] = useState(null);

  const onReply = () => {
    setFocus(!focus);
    setShowReplyBox(true);
  };

  const replies = comment?.replies?.map((reply) => (
    <Comment
      key={reply._id}
      comment={reply}
      onCommentReply={onReply}
      size='24'
    />
  ));

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
            <button onClick={onReply}>Reply</button>
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
          />
        )}
      </div>
    </div>
  );
}

export default Comment;
