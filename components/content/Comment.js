import { parseISO, formatDistanceToNowStrict } from 'date-fns';
import Avatar from '../ui/Avatar';

import styles from '../../styles/Comment.module.scss';

function Comment({ comment }) {
  const timeArr = formatDistanceToNowStrict(parseISO(comment.createdAt)).split(
    ' '
  );
  const time = timeArr[0] + timeArr[1].substring(0, 1);

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
          <button>Reply</button>
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}

export default Comment;
