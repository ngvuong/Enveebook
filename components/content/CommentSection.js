import { useEffect, useState } from 'react';
import Comment from './Comment';
import CommentBox from './CommentBox';

import styles from '../../styles/CommentSection.module.scss';

function CommentSection({ comments, postId, focus, show }) {
  const filteredComments = comments.filter(
    (comment) => comment.type === 'comment'
  );
  const [allComments, setAllComments] = useState(comments);
  const [shownComments, setShownComments] = useState(
    filteredComments[0] ? [filteredComments[0]] : []
  );

  useEffect(() => {
    if (comments.length !== allComments.length) {
      if (comments.length > allComments.length) {
        setAllComments(() => {
          setShownComments((prevComments) => {
            if (comments[0].type === 'comment') {
              return [comments[0], ...prevComments];
            } else {
              const shownCommentIds = prevComments.map(
                (comment) => comment._id
              );
              return filteredComments.filter((comment) =>
                shownCommentIds.includes(comment._id)
              );
            }
          });

          return comments;
        });
      } else {
        setAllComments(() => {
          const filteredCommentIds = filteredComments.map(
            (comment) => comment._id
          );
          setShownComments((prevComments) => {
            const newCommentIds = prevComments
              .filter((comment) => filteredCommentIds.includes(comment._id))
              .map((comment) => comment._id);

            return filteredComments.filter((comment) =>
              newCommentIds.includes(comment._id)
            );
          });

          return comments;
        });
      }
    }
  }, [comments, allComments, filteredComments]);

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
