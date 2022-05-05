import styles from '../../styles/AuthForm.module.scss';

function AuthForm({ children }) {
  return (
    <form action='' method='POST' className={styles.form}>
      {children}
    </form>
  );
}

export default AuthForm;
