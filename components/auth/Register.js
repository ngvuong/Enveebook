import { useState } from 'react';
import AuthForm from './AuthForm';

import { AiFillFacebook, AiOutlineUserAdd } from 'react-icons/ai';
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
    console.log(errors);
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
            console.log(error);
            console.log(errors.emailError);
            setErrors({ ...errors, [error.param + 'Error']: error.message });
          });
        } else {
          console.log('Successfully registered');
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
          placeholder='Username'
          minLength='3'
          autoFocus
          required
        />
        {usernameError && <span role='alert'>{usernameError}</span>}
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
          placeholder='Email'
          required
        />
        {emailError && <span role='alert'>{emailError}</span>}
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
      <button type='submit' className={styles.btn_green}>
        <AiOutlineUserAdd /> Sign Up
      </button>
      <button type='button' className={styles.btn_blue}>
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
