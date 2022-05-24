import { useState } from 'react';
import Image from 'next/image';

import styles from '../../styles/Avatar.module.scss';

function Avatar({ height, width, user }) {
  const [isError, setIsError] = useState(false);

  return (
    <>
      {user &&
        (user.image.url && !isError ? (
          <Image
            src={user.image.url}
            className={styles.image}
            width={width}
            height={height}
            quality={100}
            alt='Profile avatar'
            draggable='false'
            onError={() => setIsError(true)}
          />
        ) : (
          <span className={styles.avatar}>{user.name[0]}</span>
        ))}
    </>
  );
}

export default Avatar;
