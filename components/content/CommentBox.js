import { useRef } from 'react';
import Avatar from '../ui/Avatar';
import { useUser } from '../../contexts/userContext';

import styles from '../../styles/CommentBox.module.scss';

function CommentBox({ placeholder }) {
  const inputRef = useRef(null);
  const [user] = useUser();

  const onSubmit = (e) => {
    e.preventDefault();
    const content = inputRef.current.value.trim();

    if (!content) {
      return;
    }

    // const data = fetch('/api/comments', {)

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
