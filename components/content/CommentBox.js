import { useEffect, useRef } from 'react';
import Avatar from '../ui/Avatar';
import { useUser } from '../../contexts/userContext';

import styles from '../../styles/CommentBox.module.scss';
import { toast } from 'react-toastify';

function CommentBox({ placeholder, postId, focus }) {
  const inputRef = useRef(null);
  const [user] = useUser();

  useEffect(() => {
    console.log('focus', focus);
    if (focus === null) {
      return;
    } else {
      inputRef.current.focus();
    }
  }, [focus]);

  const onSubmit = (e) => {
    e.preventDefault();
    const content = inputRef.current.value.trim();

    if (!content) {
      return;
    }

    const data = fetch(`/api/posts/${postId}/comments`, {
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

    inputRef.current.value = '';
  };

  return (
    <div className={styles.container}>
      {user && <Avatar height='32' width='32' user={user} />}
      <form action='' method='POST' onSubmit={onSubmit}>
        <input type='text' placeholder={placeholder} ref={inputRef} autoFocus />
      </form>
    </div>
  );
}

export default CommentBox;
