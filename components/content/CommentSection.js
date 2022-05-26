import Comment from './Comment';
import CommentBox from './CommentBox';

import styles from '../../styles/CommentSection.module.scss';

function CommentSection({ post, focus }) {
  const commentList = post.comments.map((comment) => (
    <Comment key={comment._id} comment={comment} />
  ));

  return (
    <section className={styles.container}>
      {commentList[0]}
      <CommentBox
        placeholder='Write a comment...'
        postId={post._id}
        focus={focus}
      />
    </section>
  );
}

export default CommentSection;
