import { useEffect, useRef } from 'react';
import Avatar from '../ui/Avatar';
import { useUser } from '../../contexts/userContext';

import styles from '../../styles/CommentBox.module.scss';
import { toast } from 'react-toastify';

function CommentBox({ placeholder, postId, focus, setComment }) {
  const inputRef = useRef(null);
  const [user] = useUser();

  useEffect(() => {
    if (focus === null) {
      return;
    } else {
      inputRef.current.focus();
    }
  }, [focus]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const content = inputRef.current.value.trim();

    if (!content) {
      return;
    }

    const data = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, user_id: user.id }),
    }).then((res) => res.json());

    if (data.error) {
      return toast.error(data.error, {
        toastId: 'comment-error',
      });
    }

    setComment();
    inputRef.current.value = '';
  };

  return (
    <div className={styles.container}>
      {user && <Avatar height='32' width='32' user={user} />}
      <form action='' method='POST' onSubmit={onSubmit}>
        <input type='text' placeholder={placeholder} ref={inputRef} />
      </form>
    </div>
  );
}

export default CommentBox;
