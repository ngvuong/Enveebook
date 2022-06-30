import { useState, forwardRef, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import Overlay from '../layout/Overlay';
import Avatar from './Avatar';
import FileInput from './FileInput';
import AutosizeTextarea from './AutosizeTextarea';
import useFeed from '../../hooks/useFeed';
import usePosts from '../../hooks/usePosts';

import styles from '../../styles/NewPostModal.module.scss';

const NewPostModal = forwardRef(({ user, onClose }, ref) => {
  const [formData, setFormData] = useState({ text: '', image: '' });
  const fileRef = useRef(null);
  const { setFeed } = useFeed(user._id);
  const { setPosts } = usePosts(user._id);

  const { text, image } = formData;

  const onTextareaChange = (e) => {
    setFormData({ ...formData, text: e.target.value });
  };

  const onInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    } else {
      setFormData({ ...formData, image: '' });
    }
  };

  const onRemove = () => {
    setFormData({ ...formData, image: '' });
    fileRef.current.value = '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const file = fileRef.current.files[0];
    const formData = new FormData();

    if (!text.trim() && !file) {
      return toast.error('Please provide post content', {
        toastId: 'post-error',
      });
    }

    formData.append('image', file);
    formData.append('text', text.trim());
    formData.append('user_id', user._id);

    const data = await fetch('/api/posts', {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());

    if (data.error) {
      return toast.error(data.error, {
        toastId: 'post-error',
      });
    }

    if (data.message) {
      setFeed();
      setPosts();

      toast.success(data.message, {
        toastId: 'post-success',
      });
    }

    onClose();
  };

  return (
    <Overlay>
      <div className={styles.container} ref={ref}>
        <h2>Create post</h2>
        <hr />
        <div className={styles.profileWrapper}>
          <Avatar height='50' width='50' user={user} />
          <span>{user.name}</span>
        </div>
        <form action='' method='POST' onSubmit={onSubmit}>
          <AutosizeTextarea
            name='text'
            value={text}
            onChange={onTextareaChange}
            placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
            cols='30'
            rows='3'
            autoFocus
          />
          {image && (
            <div className={styles.imageContainer}>
              <Image src={image} layout='fill' quality={100} alt='Preview' />
              <button
                type='button'
                className={styles.btn_remove}
                onClick={onRemove}
              >
                ✕
              </button>
            </div>
          )}
          <FileInput
            name='image'
            label='Upload photo'
            onInputChange={onInputChange}
            ref={fileRef}
          />
          <button type='submit' disabled={!text.trim() && !image}>
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

NewPostModal.displayName = 'NewPostModal';

export default NewPostModal;
