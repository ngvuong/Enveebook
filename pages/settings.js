import { useEffect, useRef, useState } from 'react';
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
  const [activeForm, setActiveForm] = useState('');
  const [filename, setFileName] = useState('');
  const [textareaValue, setTextareaValue] = useState(user.bio);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const avatarRef = useRef(null);
  const bioRef = useRef(null);
  const passwordRef = useRef(null);

  const { currentPassword, newPassword, confirmPassword } = passwordFormData;

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

  const onFormDataChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData({ ...passwordFormData, [name]: value });
  };

  const onPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('Please fill out all fields', {
        toastId: 'password-error',
      });
    }

    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match', {
        toastId: 'password-error',
      });
    }

    const data = await fetch('/api/user/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        user_id: user.id,
      }),
    }).then((res) => res.json());

    if (data.error) {
      return toast.error(data.error, {
        toastId: 'password-error',
      });
    }

    toast.success('Password updated successfully', {
      toastId: 'password-success',
    });
  };

  return (
    <div className={styles.container}>
      <Avatar height='75' width='75' />
      <div>
        <button
          onClick={() => {
            if (activeForm === 'avatar') {
              setActiveForm('');
            } else {
              setActiveForm('avatar');
              avatarRef.current.focus();
            }
          }}
        >
          <FaPen /> Avatar
        </button>
        <button
          onClick={() => {
            if (activeForm === 'bio') {
              setActiveForm('');
            } else {
              setActiveForm('bio');
              const end = bioRef.current.value.length;
              bioRef.current.setSelectionRange(end, end);
              bioRef.current.focus();
            }
          }}
        >
          <FaPen /> Bio
        </button>
        <button
          onClick={() => {
            if (activeForm === 'password') {
              setActiveForm('');
            } else {
              setActiveForm('password');
              passwordRef.current.focus();
            }
          }}
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
          ref={avatarRef}
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
          ref={bioRef}
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
        onSubmit={onPasswordSubmit}
        className={activeForm === 'password' ? styles.active : undefined}
      >
        <label htmlFor='currentPassword'>Current password</label>
        <input
          type='password'
          name='currentPassword'
          id='currentPassword'
          value={currentPassword}
          onChange={onFormDataChange}
          placeholder='Current password'
          minLength='6'
          required
          ref={passwordRef}
        />
        <label htmlFor='newPassword'>New password</label>
        <input
          type='password'
          name='newPassword'
          id='newPassword'
          value={newPassword}
          onChange={onFormDataChange}
          placeholder='New password'
          minLength='6'
          required
        />
        <label htmlFor='confirmPassword'>Confirm password</label>
        <input
          type='password'
          name='confirmPassword'
          id='confirmPassword'
          value={confirmPassword}
          onChange={onFormDataChange}
          placeholder='Confirm password'
          minLength='6'
          required
        />
        <button
          type='submit'
          disabled={
            !currentPassword ||
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword
          }
        >
          Update
        </button>
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
