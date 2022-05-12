import Image from 'next/image';

import styles from '../../styles/Avatar.module.scss';

function Avatar({ user }) {
  return (
    <>
      {user?.image ? (
        <Image
          src={user.image}
          className={styles.image}
          width={50}
          height={50}
          quality={80}
          alt='Profile avatar'
        />
      ) : (
        <span className={styles.avatar}>{user.name[0]}</span>
      )}
    </>
  );
}

export default Avatar;
