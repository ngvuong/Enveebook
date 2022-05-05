import AuthForm from '../../components/auth/AuthForm';
import Link from 'next/link';

import { AiFillFacebook, AiOutlineLogin } from 'react-icons/ai';
import styles from '../../styles/AuthForm.module.scss';

function Login() {
  return (
    <AuthForm>
      <h1>Log In</h1>
      <hr />
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
      <button type='submit' className={styles.btn_purple}>
        <AiOutlineLogin /> Log In
      </button>
      <button type='button' className={styles.btn_blue}>
        <AiFillFacebook /> Log In with Facebook
      </button>
      <hr />
      <button type='button' className={styles.btn_green}>
        <Link href='/auth/register'>Sign Up</Link>
      </button>
    </AuthForm>
  );
}

export default Login;
