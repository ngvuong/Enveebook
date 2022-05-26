import { useEffect, useState } from 'react';
import Comment from './Comment';
import CommentBox from './CommentBox';
import useComment from '../../hooks/useComment';

import styles from '../../styles/CommentSection.module.scss';

function CommentSection({ post, focus }) {
  const [shownComments, setShownComments] = useState(
    post.comments[0] ? [post.comments[0]] : []
  );
  const { comments, isLoading, isError, setComment } = useComment(post._id);

  useEffect(() => {
    console.log(comments);
    if (comments && comments.length !== post.comments.length) {
      setShownComments([comments[0], ...shownComments]);
    }
  }, [comments]);

  if (isError) {
    return <p>Cannot load comments</p>;
  }

  const commentList = shownComments.map((comment) => (
    <Comment key={comment._id} comment={comment} />
  ));

  return (
    <section className={styles.container}>
      {commentList}
      <CommentBox
        placeholder='Write a comment...'
        postId={post._id}
        focus={focus}
        setComment={setComment}
      />
    </section>
  );
}

export default CommentSection;
