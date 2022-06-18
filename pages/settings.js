import { useEffect, useRef, useState } from 'react';
import { getSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import Avatar from '../components/ui/Avatar';
import FileInput from '../components/ui/FileInput';
import AutosizeTextarea from '../components/ui/AutosizeTextarea';
import { useUser } from '../contexts/userContext';

import { FaPen } from 'react-icons/fa';
import styles from '../styles/Settings.module.scss';

function Settings({ user, setActivePage }) {
  const [currentUser, setUser] = useUser();
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

  useEffect(() => {
    setActivePage('settings');
    return () => {
      toast.dismiss();
    };
  }, [setActivePage]);

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

    const data = await fetch(`/api/user/${user._id}/avatar`, {
      method: 'PUT',
      body: formData,
    }).then((res) => res.json());

    if (data.error) {
      return toast.error(data.error, {
        toastId: 'avatar-error',
      });
    } else {
      setUser({ ...currentUser, image: data });
      toast.success('Avatar updated successfully', {
        toastId: 'avatar-success',
      });
      fileInput.value = null;
      setFileName('');
      setActiveForm('');
    }
  };

  const onRemoveAvatar = async () => {
    if (!currentUser.image.url) {
      return toast.error('You do not have an avatar', {
        toastId: 'avatar-error',
      });
    }

    const data = await fetch(`/api/user/${user._id}/avatar`, {
      method: 'PUT',
    }).then((res) => res.json());

    if (data.error) {
      return toast.error(data.error, {
        toastId: 'avatar-error',
      });
    } else {
      setUser({ ...currentUser, image: data });
      toast.success('Avatar removed successfully', {
        toastId: 'avatar-success',
      });
      setActiveForm('');
    }
  };

  const onTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const onBioSubmit = async (e) => {
    e.preventDefault();

    const bio = textareaValue.trim();

    if (bio === user.bio) {
      return toast.error('Bio is already up to date', {
        toastId: 'bio-error',
      });
    }

    const data = await fetch(`/api/user/${user._id}/bio`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bio }),
    }).then((res) => res.json());

    if (data.error) {
      return toast.error(data.error, {
        toastId: 'bio-error',
      });
    } else {
      setUser({ ...currentUser, bio: data });
      toast.success('Bio updated successfully', {
        toastId: 'bio-success',
      });
      setActiveForm('');
    }
  };

  const onFormDataChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData({ ...passwordFormData, [name]: value });
  };

  const onPasswordSubmit = async (e) => {
    e.preventDefault();

    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      return toast.error('Please fill out all fields', {
        toastId: 'password-error',
      });
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      return toast.error('New passwords do not match', {
        toastId: 'password-error',
      });
    }

    if (newPassword.trim().length < 6) {
      return toast.error('Password must be at least 6 characters', {
        toastId: 'password-error',
      });
    }

    const data = await fetch(`/api/user/${user._id}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
        confirmPassword: confirmPassword.trim(),
      }),
    }).then((res) => res.json());

    if (data.error) {
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      return toast.error(data.error, {
        toastId: 'password-error',
      });
    }

    toast.success(data.message, {
      toastId: 'password-success',
    });
    setPasswordFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setActiveForm('');
  };

  return (
    <div className={styles.container}>
      <Avatar height='150' width='150' user={currentUser || user} />
      <p>{currentUser?.bio || user.bio}</p>
      <div className={styles.buttons}>
        <button
          onClick={() => {
            if (activeForm === 'avatar') {
              setActiveForm('');
            } else {
              setActiveForm('avatar');
              avatarRef.current.focus();
            }
          }}
          className={activeForm === 'avatar' ? styles.focus : undefined}
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
          className={activeForm === 'bio' ? styles.focus : undefined}
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
          className={activeForm === 'password' ? styles.focus : undefined}
        >
          <FaPen /> Password
        </button>
      </div>

      <div className={styles.forms}>
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
          <button
            type='button'
            onClick={onRemoveAvatar}
            disabled={currentUser && !currentUser.image.url}
          >
            Remove avatar
          </button>
        </form>
        <form
          action=''
          method='POST'
          onSubmit={onBioSubmit}
          className={activeForm === 'bio' ? styles.active : undefined}
        >
          <AutosizeTextarea
            name='bio'
            id='bio'
            value={textareaValue}
            onChange={onTextareaChange}
            cols='30'
            rows='4'
            placeholder='About me'
            spellCheck='false'
            ref={bioRef}
          />
          <button type='submit' disabled={user?.bio === textareaValue}>
            Update
          </button>
        </form>
        <form
          action=''
          method='POST'
          onSubmit={onPasswordSubmit}
          className={activeForm === 'password' ? styles.active : undefined}
        >
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
