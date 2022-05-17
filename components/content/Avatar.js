import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useUser } from '../../contexts/userContext';

import styles from '../../styles/Avatar.module.scss';

function Avatar() {
  const [{ user: currentUser }] = useUser();
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
        (user?.image ? (
          <Image
            src={user.image}
            className={styles.image}
            width={50}
            height={50}
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
