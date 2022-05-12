import { useState, forwardRef } from 'react';
import Overlay from '../layout/Overlay';

import styles from '../../styles/NewPostModal.module.scss';
import { FaFileImage } from 'react-icons/fa';
import Avatar from './Avatar';
import Link from 'next/link';

const NewPostModal = forwardRef(({ user, onClose }, ref) => {
  const [formData, setFormData] = useState({ content: '', image: '' });

  const { content, image } = formData;

  const onUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: URL.createObjectURL(file) });
  };

  return (
    <Overlay>
      <div className={styles.container} ref={ref}>
        <h2>Create post</h2>
        <hr />
        <div>
          <Link href='/profile'>
            <a>
              <Avatar user={user} />
            </a>
          </Link>
          <span>{user.name}</span>
        </div>
        <form>
          <textarea
            name='post'
            value={content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
            cols='30'
            rows='5'
          ></textarea>
          {image && <img src={image} alt='Preview' />}
          <input type='file' name='photo' id='photo' onChange={onUpload} />
          <label htmlFor='photo'>
            Upload photo <FaFileImage />
          </label>
          <button type='submit' disabled={!content && !image}>
            Post
          </button>
        </form>
        <button className={styles.btn_close} onClick={onClose}>
          ✕
        </button>
      </div>
    </Overlay>
  );
});

export default NewPostModal;
