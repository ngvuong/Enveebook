import NewPostModal from './NewPostModal';
import useClickOutside from '../../hooks/useClickOutside';

import { FaUserCircle } from 'react-icons/fa';
import styles from '../../styles/NewPostBox.module.scss';

function NewPostBox({ session }) {
  const { user } = session;
  const username = user?.name?.split(' ')[0];
  const { triggerRef, nodeRef, show, setShow } = useClickOutside(false);

  return (
    <div className={styles.container}>
      {user?.image ? (
        <img src={user.image} alt='Profile avatar' />
      ) : (
        <FaUserCircle />
      )}
      <input
        type='text'
        ref={triggerRef}
        readOnly
        placeholder={`What's on your mind, ${username}?`}
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
