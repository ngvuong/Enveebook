import { useEffect, useState, Fragment } from 'react';
import Avatar from './Avatar';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { formatDate } from '../../lib/dateFormat';

import styles from '../../styles/Chatroom.module.scss';

function Chatroom({ chat, recipient, currentUser }) {
  const [messages, setMessages] = useState();
  console.log(chat);

  useEffect(() => {
    const searchQuery = query(
      collection(getFirestore(), `chats/${chat.id}/messages`),
      orderBy('time', 'asc')
    );
    getDocs(searchQuery).then((docs) => {
      const results = [];
      docs.forEach((doc) => {
        const docData = doc.data();
        docData.id = doc.id;
        results.push(docData);
      });
      console.log(results);
      setMessages(results);
    });
  }, [chat]);

  console.log(messages);

  const messageList =
    messages &&
    messages.map((message) => {
      const author =
        message.user === recipient._id ? 'recipient' : 'currentUser';

      return (
        <Fragment key={message.id}>
          <p className={styles.timestamp}>
            {formatDate(new Date(message.time.seconds * 1000).toISOString())}
          </p>
          <div className={`${styles.message} ${styles[author]}`}>
            {author === 'recipient' && (
              <Avatar height='28' width='28' user={recipient} link={false} />
            )}
            <p className={styles.messageText}>{message.text}</p>
          </div>
        </Fragment>
      );
    });

  return (
    <>
      <div className={styles.head}>
        <Avatar height='35' width='35' user={recipient} link={false} />
        {recipient.name}
      </div>

      <div className={styles.messages}>{messageList}</div>
    </>
  );
}

export default Chatroom;
