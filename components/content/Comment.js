import { useState } from 'react';
import Avatar from '../ui/Avatar';
import CommentBox from './CommentBox';
import { formatDate } from '../../lib/dateFormat';

import styles from '../../styles/Comment.module.scss';

function Comment({ comment }) {
  const [showReplyBox, setShowReplyBox] = useState(false);

  return (
    <div className={styles.container}>
      <Avatar height='32' width='32' user={comment.author} />
      <div>
        <div className={styles.comment}>
          <span>{comment.author.name}</span>
          <p>{comment.content}</p>
        </div>
        <div className={styles.reaction}>
          <button>Like</button>
          <button onClick={() => setShowReplyBox(true)}>Reply</button>
          <span>{formatDate(comment.createdAt, 'short')}</span>
        </div>
        {showReplyBox && <CommentBox />}
      </div>
    </div>
  );
}

export default Comment;
