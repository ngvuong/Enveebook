import { useState } from 'react';
import AuthForm from '../../components/auth/AuthForm';
import { AiFillFacebook } from 'react-icons/ai';

import styles from '../../styles/AuthForm.module.scss';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { username, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <AuthForm onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <hr />
      <div>
        <label htmlFor='username'>Username</label>
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
      </div>
      <div>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          name='email'
          id='email'
          onChange={onChange}
          value={email}
          placeholder='Email'
          required
        />
      </div>
      <div>
        <label htmlFor='password'>Password</label>
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
      </div>
      <div>
        <label htmlFor='confirmPassword'>Confirm Password</label>
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
      </div>
      <button type='submit' className={styles.btn_submit}>
        Sign Up
      </button>
      <button type='button' className={styles.btn_blue}>
        <AiFillFacebook /> Sign Up with Facebook
      </button>
    </AuthForm>
  );
}

export default Register;
