import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import styles from '../../styles/Avatar.module.scss';

function Avatar({ height, width, user }) {
  const [isError, setIsError] = useState(false);

  return (
    <Link href={`/profile/${user.id || user._id}`}>
      <a className={styles.link}>
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
            <span
              className={styles.avatar}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                fontSize: `${width / 2}px`,
              }}
            >
              {user.name[0]}
            </span>
          ))}
      </a>
    </Link>
  );
}

export default Avatar;
