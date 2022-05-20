import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import Avatar from '../components/ui/Avatar';
import FileInput from '../components/ui/FileInput';
import AutosizeTextarea from '../components/ui/AutosizeTextarea';
import { useUser } from '../contexts/userContext';

import { FaPen } from 'react-icons/fa';
import styles from '../styles/Settings.module.scss';

function Settings({ user }) {
  const [, setUser] = useUser();
  const [textareaValue, setTextareaValue] = useState(user?.bio);
  const [showAvatarUpdate, setShowAvatarUpdate] = useState(false);
  const [activeForm, setActiveForm] = useState('');
  const [filename, setFileName] = useState('');

  const onInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const { name: fileName } = file;
      setFileName(fileName);
      toast.dismiss('avatar-error');
    } else {
      setFileName('');
    }
  };

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  const onAvatarSubmit = async (e) => {
    e.preventDefault();

    const fileInput = e.target.elements.avatar;
    const file = fileInput.files[0];
    const formData = new FormData();

    if (!file) {
      return toast.error('Please select an image', {
        toastId: 'avatar-error',
      });
    }

    formData.append('image', file);
    formData.append('user_id', user.id);

    const data = await fetch('/api/user/avatar', {
      method: 'PUT',
      body: formData,
    }).then((res) => res.json());

    if (data.error) {
      return toast.error(data.error, {
        toastId: 'avatar-error',
      });
    } else {
      setUser(data);
      toast.success('Avatar updated successfully', {
        toastId: 'avatar-success',
      });
      fileInput.value = null;
      setFileName('');
      setShowAvatarUpdate(false);
    }
  };

  const onTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const onBioSubmit = async (e) => {
    e.preventDefault();

    if (textareaValue === user.bio) {
      return toast.error('Bio is already up to date', {
        toastId: 'bio-error',
      });
    }

    const data = await fetch('/api/user/bio', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bio: textareaValue,
        user_id: user.id,
      }),
    }).then((res) => res.json());

    if (data.error) {
      return toast.error(data.error, {
        toastId: 'bio-error',
      });
    } else {
      setUser(data);
      toast.success('Bio updated successfully', {
        toastId: 'bio-success',
      });
    }
  };

  return (
    <div className={styles.container}>
      <Avatar height='75' width='75' />
      <div>
        <button
          onClick={() =>
            activeForm === 'avatar'
              ? setActiveForm('')
              : setActiveForm('avatar')
          }
        >
          <FaPen /> Avatar
        </button>
        <button
          onClick={() =>
            activeForm === 'bio' ? setActiveForm('') : setActiveForm('bio')
          }
        >
          <FaPen /> Bio
        </button>
        <button
          onClick={() =>
            activeForm === 'password'
              ? setActiveForm('')
              : setActiveForm('password')
          }
        >
          <FaPen /> Password
        </button>
      </div>

      <form
        action=''
        method='POST'
        onSubmit={onAvatarSubmit}
        className={activeForm === 'avatar' ? styles.active : undefined}
      >
        <p>{filename}</p>

        <FileInput
          name='avatar'
          label='Upload picture'
          onInputChange={onInputChange}
        />
        <button type='submit' disabled={!filename}>
          Update
        </button>
      </form>
      <form
        action=''
        method='POST'
        onSubmit={onBioSubmit}
        className={activeForm === 'bio' ? styles.active : undefined}
      >
        <label htmlFor='bio'>Bio</label>
        <AutosizeTextarea
          name='bio'
          id='bio'
          value={textareaValue}
          onChange={onTextareaChange}
          cols='30'
          rows='4'
          placeholder='About me'
        />
        <button
          type='submit'
          disabled={!textareaValue || user?.bio === textareaValue}
        >
          Update
        </button>
      </form>
      <form
        action=''
        method='POST'
        className={activeForm === 'password' ? styles.active : undefined}
      >
        <label htmlFor='oldPassword'>Current password</label>
        <input
          type='password'
          name='oldPassword'
          id='oldPassword'
          placeholder='Current password'
        />
        <label htmlFor='newPassword'>New password</label>
        <input
          type='password'
          name='newPassword'
          id='newPassword'
          placeholder='New password'
        />
        <label htmlFor='confirmPassword'>Confirm password</label>
        <input
          type='password'
          name='confirmPassword'
          id='confirmPassword'
          placeholder='Confirm password'
        />
        <button type='submit'>Update</button>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
}

export default Settings;
