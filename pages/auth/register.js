import { AiFillFacebook } from 'react-icons/ai';
import AuthForm from '../../components/auth/AuthForm';

import styles from '../../styles/AuthForm.module.scss';

function Register() {
  return (
    <AuthForm>
      <h1>Sign Up</h1>
      <hr />
      <div>
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          name='username'
          id='username'
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
