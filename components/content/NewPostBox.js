import Link from 'next/link';
import NewPostModal from './NewPostModal';
import Avatar from './Avatar';
import useClickOutside from '../../hooks/useClickOutside';

import styles from '../../styles/NewPostBox.module.scss';

function NewPostBox({ user }) {
  const { triggerRef, nodeRef, show, setShow } = useClickOutside(false);
  const username = user?.name;

  return (
    <div className={styles.container}>
      <Link href='/profile'>
        <a>
          <Avatar />
        </a>
      </Link>
      <input
        type='text'
        ref={triggerRef}
        readOnly
        placeholder={`What's on your mind, ${username.split(' ')[0]}?`}
      />
      {show && (
        <NewPostModal
          username={username}
          ref={nodeRef}
          onClose={() => setShow(false)}
        />
      )}
    </div>
  );
}

export default NewPostBox;
