import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useUser } from '../../contexts/userContext';

import styles from '../../styles/Avatar.module.scss';

function Avatar({ height, width }) {
  const [currentUser] = useUser();
  const [user, setUser] = useState(currentUser);
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
        (user?.image.url ? (
          <Image
            src={user.image.url}
            className={styles.image}
            width={width}
            height={height}
            quality={80}
            alt='Profile avatar'
            draggable='false'
          />
        ) : (
          <span className={styles.avatar}>{user?.name[0]}</span>
        ))}
    </>
  );
}

export default Avatar;
