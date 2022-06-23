import { useEffect, useState, Fragment, useRef } from 'react';
import Avatar from './Avatar';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  doc,
} from 'firebase/firestore';
import { formatDate } from '../../lib/dateFormat';

import { FaPaperPlane } from 'react-icons/fa';
import styles from '../../styles/Chatroom.module.scss';

function Chatroom({ chat, recipient, currentUser }) {
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    const searchQuery = query(
      collection(getFirestore(), `chats/${chat.id}/messages`),
      orderBy('time', 'asc')
    );

    const unsubscribe = onSnapshot(searchQuery, (querySnapshot) => {
      const results = [];

      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        docData.id = doc.id;

        results.push(docData);
      });

      setMessages(results);
    });

    return unsubscribe;
  }, [chat]);

  useEffect(() => {
    scrollRef.current.scrollIntoView();
  }, [messages]);

  const onSend = async (e) => {
    e.preventDefault();

    const text = inputRef.current.value.trim();

    if (!text) return;

    try {
      await addDoc(collection(getFirestore(), `chats/${chat.id}/messages`), {
        user: currentUser._id,
        text,
        time: serverTimestamp(),
      });

      inputRef.current.value = '';

      await setDoc(
        doc(getFirestore(), 'chats', chat.id),
        { updatedAt: serverTimestamp() },
        { merge: true }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const messageList = messages.map((message) => {
    const author = message.user === recipient._id ? 'recipient' : 'currentUser';

    return (
      <Fragment key={message.id}>
        <p className={styles.timestamp}>
          {message.time
            ? formatDate(new Date(message.time.seconds * 1000).toISOString())
            : 'Now'}
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

      <div className={styles.messages} onClick={() => inputRef.current.focus()}>
        {messageList}
        <div ref={scrollRef}></div>
      </div>
      <form
        action=''
        method='POST'
        className={styles.messageForm}
        onSubmit={onSend}
      >
        <input type='text' placeholder='Aa' ref={inputRef} />
        <button>
          <FaPaperPlane />
        </button>
      </form>
    </>
  );
}

export default Chatroom;
