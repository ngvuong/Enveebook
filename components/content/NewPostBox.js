import { useState } from 'react';
import NewPostModal from './NewPostModal';

import { FaUserCircle } from 'react-icons/fa';
import styles from '../../styles/NewPostBox.module.scss';

function NewPostBox({ session }) {
  const [showModal, setShowModal] = useState(false);
  const { user } = session;
  const username = user?.name?.split(' ')[0];

  return (
    <div className={styles.container}>
      {user?.image ? (
        <img src={user.image} alt='Profile avatar' />
      ) : (
        <FaUserCircle />
      )}
      <input
        type='text'
        onClick={() => setShowModal(true)}
        readOnly
        placeholder={`What's on your mind, ${username}?`}
      />
      {showModal && (
        <NewPostModal username={username} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default NewPostBox;
