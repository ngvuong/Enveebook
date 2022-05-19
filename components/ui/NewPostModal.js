import { useState, forwardRef } from 'react';
import Link from 'next/link';
import Overlay from '../layout/Overlay';
import Avatar from './Avatar';
import FileInput from './FileInput';
import AutosizeTextarea from './AutosizeTextarea';

import styles from '../../styles/NewPostModal.module.scss';

const NewPostModal = forwardRef(({ username, onClose }, ref) => {
  const [formData, setFormData] = useState({ content: '', image: '' });

  const { content, image } = formData;

  const onTextareaChange = (e) => {
    setFormData({ ...formData, content: e.target.value });
  };

  const onInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    } else {
      setFormData({ ...formData, image: '' });
    }
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
          <AutosizeTextarea
            name='content'
            value={content}
            onChange={onTextareaChange}
            placeholder={`What's on your mind, ${username.split(' ')[0]}?`}
            cols='30'
            rows='4'
            autoFocus
          />
          {image && <img src={image} alt='Preview' />}
          <FileInput
            name='image'
            label='Upload photo'
            onInputChange={onInputChange}
          />
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
