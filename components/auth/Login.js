import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import AuthForm from './AuthForm';

import {
  AiFillFacebook,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from 'react-icons/ai';
import styles from '../../styles/AuthForm.module.scss';

function Login({ onSignup }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const emailRef = useRef(null);
  const router = useRouter();

  const { email, password } = formData;

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    signIn('credentials', {
      email,
      password,
      callbackUrl: '/home',
      redirect: false,
    }).then((res) => {
      if (res.error) {
        setError(res.error);
      } else {
        router.replace(res.url);
      }
    });
  };

  return (
    <AuthForm onSubmit={onSubmit}>
      <h2>Log In</h2>
      <hr />
      {error && (
        <div role='alert'>
          <p className={styles.error}>{error}</p>
        </div>
      )}
      <div>
        <label htmlFor='email'>
          Email<span>*</span>
        </label>
        <input
          type='email'
          name='email'
          id='email'
          value={email}
          onChange={onChange}
          ref={emailRef}
          placeholder='Email'
          required
        />
      </div>
      <div>
        <label htmlFor='password'>
          Password<span>*</span>
        </label>
        <input
          type='password'
          name='password'
          id='password'
          value={password}
          onChange={onChange}
          placeholder='Password'
          minLength='6'
          required
        />
      </div>
      <button type='submit' className={styles.btn_purple}>
        <AiOutlineLogin /> Log In
      </button>
      <button type='button' className={styles.btn_blue}>
        <AiFillFacebook /> Log In with Facebook
      </button>
      <hr />
      <button type='button' className={styles.btn_green} onClick={onSignup}>
        <AiOutlineUserAdd /> Sign Up
      </button>
    </AuthForm>
  );
}

export default Login;
