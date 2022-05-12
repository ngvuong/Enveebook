import styles from '../../styles/Avatar.module.scss';

function Avatar({ user }) {
  return (
    <>
      {user?.image ? (
        <img src={user.image} className={styles.image} alt='Profile avatar' />
      ) : (
        <span className={styles.avatar}>{user.name[0]}</span>
      )}
    </>
  );
}

export default Avatar;
