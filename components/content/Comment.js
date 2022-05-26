import Avatar from '../ui/Avatar';

import styles from '../../styles/Comment.module.scss';

function Comment({ comment }) {
  return (
    <div className={styles.comment}>
      <Avatar height='32' width='32' user={comment.author} />
      <div>
        <span>{comment.author.name}</span>
        <p>{comment.content}</p>
      </div>
    </div>
  );
}

export default Comment;
