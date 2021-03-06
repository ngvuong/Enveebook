import { useEffect, useRef, useState, forwardRef } from 'react';
import router from 'next/router';
import { signIn } from 'next-auth/react';
import AuthForm from './AuthForm';

import {
  AiFillFacebook,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineUser,
  AiFillCheckCircle,
  AiFillExclamationCircle,
} from 'react-icons/ai';
import styles from '../../styles/AuthForm.module.scss';

const Login = forwardRef((_props, ref) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef(null);

  const { email, password } = formData;

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const onFacebookSignIn = () => {
    setIsLoading(true);
    signIn('facebook');
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);
    signIn('credentials', {
      email,
      password,
      callbackUrl: '/home',
      redirect: false,
    }).then((res) => {
      if (res.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.replace(res.url);
      }
    });
  };

  const onTestLogin = () => {
    setIsLoading(true);
    signIn('credentials', {
      email: process.env.NEXT_PUBLIC_TEST_EMAIL,
      password: process.env.NEXT_PUBLIC_TEST_PASSWORD,
      callbackUrl: '/home',
      redirect: false,
    }).then((res) => {
      setIsLoading(false);
      router.replace(res.url);
    });
  };

  return (
    <AuthForm onSubmit={onSubmit} className={`${styles.login} ${styles.form}`}>
      <h2>Log In</h2>
      <hr />
      {error && (
        <div role='alert'>
          <p className={styles.error}>{error}</p>
        </div>
      )}
      {isLoading && <span className={styles.spinner}></span>}
      <div>
        <label htmlFor='email'>
          Email<span>*</span>
        </label>
        <input
          type='email'
          className={error ? styles.invalid : undefined}
          name='email'
          id='email'
          value={email}
          onChange={onChange}
          ref={emailRef}
          placeholder='Email'
          required
        />
        {error ? (
          <AiFillExclamationCircle className={styles.errorIcon} />
        ) : (
          <AiFillCheckCircle className={styles.checkIcon} />
        )}
      </div>
      <div>
        <label htmlFor='password'>
          Password<span>*</span>
        </label>
        <input
          type='password'
          className={error ? styles.invalid : undefined}
          name='password'
          id='password'
          value={password}
          onChange={onChange}
          placeholder='Password'
          minLength='6'
          required
        />
        {error ? (
          <AiFillExclamationCircle className={styles.errorIcon} />
        ) : (
          <AiFillCheckCircle className={styles.checkIcon} />
        )}
      </div>
      <button
        type='submit'
        className={styles.btn_purple}
        disabled={error || !email || !password}
      >
        <AiOutlineLogin /> Log In
      </button>
      <button type='button' className={styles.btn_red} onClick={onTestLogin}>
        <AiOutlineUser /> Test User
      </button>
      <button
        type='button'
        className={styles.btn_blue}
        onClick={onFacebookSignIn}
      >
        <AiFillFacebook /> Log In with Facebook
      </button>
      <hr />
      <button type='button' className={styles.btn_green} ref={ref}>
        <AiOutlineUserAdd /> Sign Up
      </button>
    </AuthForm>
  );
});

Login.displayName = 'Login';

export default Login;
