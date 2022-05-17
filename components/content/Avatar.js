import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useUser } from '../../contexts/userContext';

import styles from '../../styles/Avatar.module.scss';

function Avatar() {
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
            width={150}
            height={150}
            quality={80}
            alt='Profile avatar'
          />
        ) : (
          <span className={styles.avatar}>{user?.name[0]}</span>
        ))}
    </>
  );
}

export default Avatar;
