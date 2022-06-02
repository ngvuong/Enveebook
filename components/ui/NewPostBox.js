import Link from 'next/link';
import NewPostModal from './NewPostModal';
import Avatar from './Avatar';
import useClickOutside from '../../hooks/useClickOutside';

import styles from '../../styles/NewPostBox.module.scss';

function NewPostBox({ user }) {
  const { triggerRef, nodeRef, show, setShow } = useClickOutside(false);

  return (
    <div className={styles.container}>
      <Avatar height='50' width='50' user={user} />
      <input
        type='text'
        ref={triggerRef}
        readOnly
        placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
      />
      {show && (
        <NewPostModal
          user={user}
          ref={nodeRef}
          onClose={() => setShow(false)}
        />
      )}
    </div>
  );
}

export default NewPostBox;
