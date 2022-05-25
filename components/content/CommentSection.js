import Comment from './Comment';
import CommentBox from './CommentBox';

import styles from '../../styles/CommentSection.module.scss';

function CommentSection({ comments }) {
  const commentList = comments.map((comment) => (
    <Comment key={comment._id} comment={comment} />
  ));

  return (
    <section className={styles.container}>
      {commentList[0]}
      <CommentBox placeholder='Write a comment...' />
    </section>
  );
}

export default CommentSection;
