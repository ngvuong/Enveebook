import { useState } from 'react';
import Overlay from '../layout/Overlay';

import styles from '../../styles/NewPostModal.module.scss';
import { FaFileImage } from 'react-icons/fa';

function NewPostModal({ username, onClose }) {
  const [formData, setFormData] = useState({ content: '', image: '' });

  const { content, image } = formData;

  const onUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: URL.createObjectURL(file) });
  };

  return (
    <Overlay>
      <div className={styles.container}>
        <h2>Create post</h2>
        <hr />
        <form>
          <textarea
            name='post'
            value={content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder={`What's on your mind, ${username}?`}
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
}

export default NewPostModal;
