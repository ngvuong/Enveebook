import styles from '../../styles/AuthForm.module.scss';

function AuthForm(props) {
  return <form action='' method='POST' className={styles.form} {...props} />;
}

export default AuthForm;
