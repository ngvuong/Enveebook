import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useUser } from '../../contexts/userContext';

import styles from '../../styles/Avatar.module.scss';

function Avatar({ height, width }) {
  const [currentUser] = useUser();
  const [user, setUser] = useState(currentUser);
  const [isError, setIsError] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!currentUser) {
      setUser(session?.user);
    } else {
      setUser(currentUser);
    }
  }, [currentUser, session]);

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
