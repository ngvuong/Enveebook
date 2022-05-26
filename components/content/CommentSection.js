import { useEffect, useState } from 'react';
import Comment from './Comment';
import CommentBox from './CommentBox';
import useComment from '../../hooks/useComment';

import styles from '../../styles/CommentSection.module.scss';

function CommentSection({ comments, postId, setComment, focus, show }) {
  const [shownComments, setShownComments] = useState(
    comments[0] ? [comments[0]] : []
  );
  // const { comments, isLoading, isError, setComment } = useComment(post._id);
  console.log(shownComments);
  // useEffect(() => {
  //   if (comments) {
  //     setShownComments([comments[0], ...shownComments]);
  //   }
  // }, [comments]);

  // if (isError) {
  //   return <p>Cannot load comments</p>;
  // }

  const commentList = shownComments.map((comment) => (
    <Comment key={comment._id} comment={comment} />
  ));

  return (
    <section className={`${styles.container} ${show && styles.show}`}>
      {commentList}
      <CommentBox
        placeholder='Write a comment...'
        postId={postId}
        focus={focus}
        setComment={setComment}
      />
    </section>
  );
}

export default CommentSection;
