import styles from '../../styles/AuthForm.module.scss';

function AuthForm({ nodeRef, ...props }) {
  return <form action='' method='POST' {...props} ref={nodeRef} />;
}

export default AuthForm;
