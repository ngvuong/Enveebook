import { useState } from 'react';
import { signIn } from 'next-auth/react';
import AuthForm from './AuthForm';

import {
  AiFillFacebook,
  AiOutlineUserAdd,
  AiFillCheckCircle,
  AiFillExclamationCircle,
} from 'react-icons/ai';
import styles from '../../styles/AuthForm.module.scss';

function Register({ onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    usernameError: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
  });

  const { username, email, password, confirmPassword } = formData;
  const { usernameError, emailError, passwordError, confirmPasswordError } =
    errors;

  const onChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      if (name === 'password' || name === 'confirmPassword') {
        if (
          newData.password !== newData.confirmPassword &&
          newData.confirmPassword
        ) {
          setErrors({ ...errors, [name + 'Error']: 'Passwords do not match' });
        } else {
          setErrors({ ...errors, passwordError: '', confirmPasswordError: '' });
        }
      } else {
        setErrors({ ...errors, [name + 'Error']: '' });
      }
      return newData;
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setErrors({
      usernameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
    });

    fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          data.error.forEach((error) => {
            setErrors((prevErrors) => ({
              ...prevErrors,
              [error.param + 'Error']: error.message,
            }));
          });
        } else {
          signIn('credentials', {
            email,
            password,
            callbackUrl: '/home',
          });
        }
      });
  };

  return (
    <AuthForm onSubmit={onSubmit}>
      <h2>Sign Up</h2>
      <hr />
      <div>
        <label htmlFor='username'>
          Username<span>*</span>
        </label>
        <input
          type='text'
          name='username'
          id='username'
          onChange={onChange}
          value={username}
          className={usernameError ? styles.invalid : ''}
          placeholder='Username'
          minLength='3'
          autoFocus
          required
        />
        {usernameError ? (
          <AiFillExclamationCircle className={styles.icon} />
        ) : (
          <AiFillCheckCircle className={styles.icon} />
        )}
        {usernameError && <p role='alert'>{usernameError}</p>}
      </div>
      <div>
        <label htmlFor='signup_email'>
          Email<span>*</span>
        </label>
        <input
          type='email'
          name='email'
          id='signup_email'
          onChange={onChange}
          value={email}
          className={emailError ? styles.invalid : ''}
          placeholder='Email'
          required
        />
        {emailError ? (
          <AiFillExclamationCircle className={styles.icon} />
        ) : (
          <AiFillCheckCircle className={styles.icon} />
        )}
        {emailError && <p role='alert'>{emailError}</p>}
      </div>
      <div>
        <label htmlFor='signup_password'>
          Password<span>*</span>
        </label>
        <input
          type='password'
          name='password'
          id='signup_password'
          onChange={onChange}
          value={password}
          className={passwordError ? styles.invalid : ''}
          placeholder='Password'
          minLength='6'
          required
        />
        {passwordError ? (
          <AiFillExclamationCircle className={styles.icon} />
        ) : (
          <AiFillCheckCircle className={styles.icon} />
        )}
        {passwordError && <p role='alert'>{passwordError}</p>}
      </div>
      <div>
        <label htmlFor='confirmPassword'>
          Confirm Password<span>*</span>
        </label>
        <input
          type='password'
          name='confirmPassword'
          id='confirmPassword'
          onChange={onChange}
          value={confirmPassword}
          className={confirmPasswordError ? styles.invalid : ''}
          placeholder='Confirm Password'
          minLength='6'
          required
        />
        {confirmPasswordError ? (
          <AiFillExclamationCircle className={styles.icon} />
        ) : (
          <AiFillCheckCircle className={styles.icon} />
        )}
        {confirmPasswordError && <p role='alert'>{confirmPasswordError}</p>}
      </div>
      <button type='submit' className={styles.btn_green}>
        <AiOutlineUserAdd /> Sign Up
      </button>
      <button
        type='button'
        className={styles.btn_blue}
        onClick={() => signIn('facebook')}
      >
        <AiFillFacebook /> Sign Up with Facebook
      </button>
      <button
        type='button'
        className={styles.btn_close}
        onClick={() => onClose()}
      >
        ✕
      </button>
    </AuthForm>
  );
}

export default Register;
