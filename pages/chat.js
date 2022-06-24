import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import Avatar from '../components/ui/Avatar';
import Chatroom from '../components/ui/Chatroom';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import '../lib/firebase';
import User from '../models/user';
import dbConnect from '../lib/db';

import { FaPenNib } from 'react-icons/fa';
import styles from '../styles/Chat.module.scss';

function Chat({ currentUser, users, chats, setActivePage }) {
  const [activeChat, setActiveChat] = useState(chats[0]);

  useEffect(() => {
    setActivePage('chat');
  }, [setActivePage]);

  const chatPortals = chats.map((chat) => {
    const recipient =
      users[chat.members.find((member) => member !== currentUser._id)];

    return (
      <div
        className={`${styles.portal} ${
          chat.id === activeChat.id ? styles.active : ''
        }`}
        key={chat.id}
        onClick={() => setActiveChat(chat)}
      >
        <Avatar height='50' width='50' user={recipient} link={false} />
        <p>{recipient.name}</p>
      </div>
    );
  });

  return (
    <div className={styles.container}>
      <section className={styles.sideBar}>
        <div className={styles.sideBarHead}>
          <h1>Chats</h1>
          <button>
            <FaPenNib />
          </button>
        </div>
        <div className={styles.portals}>{chatPortals}</div>
      </section>
      <section className={styles.chatroom}>
        {activeChat ? (
          <Chatroom
            chat={activeChat}
            recipient={
              users[
                activeChat.members.find((member) => member !== currentUser._id)
              ]
            }
            currentUser={currentUser}
          />
        ) : null}
      </section>
    </div>
  );
}

export async function getServerSideProps(context) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=600'
  );

  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const searchQuery = query(
    collection(getFirestore(), 'chats'),
    where('members', 'array-contains', session.user._id),
    orderBy('updatedAt', 'desc')
  );

  const chats = [];
  const userIds = [];

  const querySnapshot = await getDocs(searchQuery);
  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    docData.id = doc.id;
    docData.members.forEach((id) => {
      if (!userIds.includes(id)) {
        userIds.push(id);
      }
    });
    chats.push(docData);
  });

  await dbConnect();

  const users = [
    ...(await User.find({ _id: { $in: userIds } }, 'name image')),
  ].reduce((acc, curr) => {
    acc[curr._id] = curr;
    return acc;
  }, {});

  return {
    props: {
      currentUser: session.user,
      users: JSON.parse(JSON.stringify(users)),
      chats: JSON.parse(JSON.stringify(chats)),
    },
  };
}

export default Chat;
