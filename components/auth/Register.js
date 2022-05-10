import { useState } from 'react';
import Link from 'next/link';
import AuthForm from './AuthForm';

import { AiFillFacebook, AiOutlineUserAdd } from 'react-icons/ai';
import styles from '../../styles/AuthForm.module.scss';

function Register() {
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
    console.log(password, confirmPassword, value);
    if (name === 'password' || name === 'confirmPassword') {
      if (password !== value || confirmPassword !== value) {
        setErrors({ ...errors, [name + 'Error']: 'Passwords do not match' });
      } else {
        setErrors({ ...errors, [name + 'Error']: '' });
      }
    }
    setFormData({ ...formData, [name]: value });
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
            setErrors({ ...errors, [error.param + 'Error']: error.message });
          });
        } else {
          console.log('Successfully registered');
        }
      });
  };

  return (
    <AuthForm onSubmit={onSubmit}>
      <div>
        <h2>Sign Up</h2>
        <p>
          Already a member?
          <Link href='/auth/login'> Log In</Link>
        </p>
      </div>
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
          placeholder='Username'
          minLength='3'
          required
        />
        {usernameError && <span role='alert'>{usernameError}</span>}
      </div>
      <div>
        <label htmlFor='email'>
          Email<span>*</span>
        </label>
        <input
          type='email'
          name='email'
          id='email'
          onChange={onChange}
          value={email}
          placeholder='Email'
          required
        />
        {emailError && <span role='alert'>{emailError}</span>}
      </div>
      <div>
        <label htmlFor='password'>
          Password<span>*</span>
        </label>
        <input
          type='password'
          name='password'
          id='password'
          onChange={onChange}
          value={password}
          placeholder='Password'
          minLength='6'
          required
        />
        {passwordError && <span role='alert'>{passwordError}</span>}
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
          placeholder='Confirm Password'
          minLength='6'
          required
        />
        {confirmPasswordError && (
          <span role='alert'>{confirmPasswordError}</span>
        )}
      </div>
      <button type='submit' className={styles.btn_submit}>
        <AiOutlineUserAdd /> Sign Up
      </button>
      <button type='button' className={styles.btn_blue}>
        <AiFillFacebook /> Sign Up with Facebook
      </button>
    </AuthForm>
  );
}

export default Register;
