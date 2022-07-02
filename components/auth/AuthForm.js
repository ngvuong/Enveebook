import styles from '../../styles/AuthForm.module.scss';

function AuthForm({ nodeRef, ...props }) {
  return (
    <form
      action=''
      method='POST'
      className={styles.form}
      {...props}
      ref={nodeRef}
    />
  );
}

export default AuthForm;
