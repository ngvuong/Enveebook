import { useState, forwardRef } from 'react';
import Link from 'next/link';
import Overlay from '../layout/Overlay';
import Avatar from './Avatar';

import { FaFileImage } from 'react-icons/fa';
import styles from '../../styles/NewPostModal.module.scss';

const NewPostModal = forwardRef(({ username, onClose }, ref) => {
  const [formData, setFormData] = useState({ content: '', image: '' });

  const { content, image } = formData;

  const onChange = (e) => {
    const target = e.target;
    setFormData({ ...formData, content: target.value });
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

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
              <Avatar height='50' width='50' />
            </a>
          </Link>
          <span>{username}</span>
        </div>
        <form>
          <textarea
            name='content'
            value={content}
            onChange={onChange}
            placeholder={`What's on your mind, ${username.split(' ')[0]}?`}
            cols='30'
            rows='4'
            autoFocus
          ></textarea>
          {image && <img src={image} alt='Preview' />}
          <input type='file' name='image' id='image' onChange={onUpload} />
          <label htmlFor='image'>
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
