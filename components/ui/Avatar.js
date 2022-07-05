import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import styles from '../../styles/Avatar.module.scss';

function Avatar({ height, width, flexSize, user, link = true }) {
  const [isError, setIsError] = useState(false);

  const avatar = (
    <>
      {user.image.url && !isError ? (
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
        <span
          className={styles.avatar}
          style={{
            width: flexSize ? flexSize : `${width}px`,
            height: flexSize ? flexSize : `${height}px`,
            fontSize: `${(width / 20) * 0.95}rem`,
          }}
        >
          {user.name[0]}
        </span>
      )}
    </>
  );

  return (
    <>
      {link ? (
        <Link href={`/profile/${user._id}`}>
          <a className={styles.link}>{avatar}</a>
        </Link>
      ) : (
        avatar
      )}
    </>
  );
}

export default Avatar;
