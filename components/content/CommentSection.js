import { useEffect, useState } from 'react';
import Comment from './Comment';
import CommentBox from './CommentBox';

import styles from '../../styles/CommentSection.module.scss';

function CommentSection({ comments, postId, focus, show }) {
  const filteredComments = comments.filter(
    (comment) => comment.type === 'comment'
  );
  const [shownComments, setShownComments] = useState(
    filteredComments[0] ? [filteredComments[0]] : []
  );

  useEffect(() => {
    if (comments[0] && comments[0]._id !== shownComments[0]?._id) {
      setShownComments((prevComments) => {
        if (comments[0].type === 'comment') {
          return [comments[0], ...prevComments];
        } else {
          const prevCommentsIds = prevComments.map((comment) => comment._id);
          const updatedComments = filteredComments.filter((comment) =>
            prevCommentsIds.includes(comment._id)
          );

          return updatedComments;
        }
      });
    }
  }, [comments]);

  const commentList = shownComments.map((comment) => (
    <Comment key={comment._id} comment={comment} size='32' show={show} />
  ));

  return (
    <section className={`${styles.container} ${show ? styles.show : ''}`}>
      {filteredComments.length > 1 &&
        filteredComments.length === shownComments.length && (
          <button onClick={() => setShownComments([filteredComments[0]])}>
            View most recent
          </button>
        )}
      {commentList}
      {filteredComments.length !== shownComments.length && (
        <button onClick={() => setShownComments(filteredComments)}>
          View all comments
        </button>
      )}
      <CommentBox postId={postId} focus={focus} size='32' />
    </section>
  );
}

export default CommentSection;
