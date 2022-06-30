import { useState, useEffect, Fragment } from 'react';
import { getSession } from 'next-auth/react';
import ReactTooltip from 'react-tooltip';
import Avatar from '../components/ui/Avatar';
import Chatroom from '../components/ui/Chatroom';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import '../lib/firebase';
import User from '../models/user';
import dbConnect from '../lib/db';

import { FaPenNib } from 'react-icons/fa';
import styles from '../styles/Chat.module.scss';
import Search from '../components/ui/Search';

function Chat({ currentUser, friends, users, chats, setActivePage }) {
  const [allChats, setAllChats] = useState(chats);
  const [activeChat, setActiveChat] = useState(allChats[0]);
  const [showSearch, setShowSearch] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setActivePage('chat');
  }, [setActivePage]);

  const onCreateChat = async (userId) => {
    const existingChat = allChats.find((chat) => chat.members.includes(userId));

    if (existingChat) {
      setActiveChat(existingChat);
      setShowSearch(false);
    } else {
      const chatData = {
        members: [userId, currentUser._id],
        updatedAt: serverTimestamp(),
      };
      const docRef = await addDoc(
        collection(getFirestore(), 'chats'),
        chatData
      );

      chatData.id = docRef.id;

      setAllChats([chatData, ...chats]);
      setActiveChat(chatData);
      setShowSearch(false);
    }
  };

  const chatPortals = allChats.map((chat) => {
    const recipient =
      users[chat.members.find((member) => member !== currentUser._id)];

    return (
      <Fragment key={chat.id}>
        <div
          className={`${styles.portal} ${
            activeChat && chat.id === activeChat.id ? styles.active : ''
          }`}
          onClick={() => {
            setShowSearch(false);
            setActiveChat(chat);
          }}
          data-tip
          data-for={chat.id}
        >
          <div className={styles.avatarWrapper}>
            <Avatar
              height='50'
              width='50'
              flexSize='100%'
              user={recipient}
              link={false}
            />
          </div>
          <p>{recipient.name}</p>
        </div>
        {isMounted && (
          <ReactTooltip
            id={chat.id}
            effect='solid'
            place='right'
            backgroundColor='#f1f1f1'
            textColor='#1f1f1f'
          >
            <span>{recipient.name}</span>
          </ReactTooltip>
        )}
      </Fragment>
    );
  });

  return (
    <div className={styles.container}>
      <section className={styles.sideBar}>
        <div className={styles.sideBarHead}>
          <div>
            <h1>Chats</h1>
            <label
              htmlFor='searchInput'
              onClick={() => {
                setActiveChat(null);
                setShowSearch(true);
              }}
              data-tip
              data-for='new-chat'
            >
              <FaPenNib />
            </label>
            {isMounted && (
              <ReactTooltip
                id='new-chat'
                effect='solid'
                backgroundColor='#f1f1f1'
                textColor='#1f1f1f'
              >
                <span>New Chat</span>
              </ReactTooltip>
            )}
          </div>
        </div>
        <div className={styles.portals}>{chatPortals}</div>
      </section>
      <section className={styles.chatroom}>
        {showSearch && (
          <div className={styles.searchContainer}>
            <span>To:</span>
            <Search users={friends} type='chat' onSelect={onCreateChat} />
          </div>
        )}
        {activeChat ? (
          <Chatroom
            key={activeChat.id}
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

  const currentUser = session.user;

  const searchQuery = query(
    collection(getFirestore(), 'chats'),
    where('members', 'array-contains', currentUser._id),
    orderBy('updatedAt', 'desc')
  );

  const chats = [];

  const querySnapshot = await getDocs(searchQuery);
  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    docData.id = doc.id;
    chats.push(docData);
  });

  await dbConnect();

  const users = [...(await User.find({}, 'name image'))].reduce((acc, curr) => {
    acc[curr._id] = curr;
    return acc;
  }, {});

  const friends = await User.find(
    { _id: { $in: currentUser.friends } },
    'name image'
  );

  return {
    props: {
      currentUser,
      friends: JSON.parse(JSON.stringify(friends)),
      users: JSON.parse(JSON.stringify(users)),
      chats: JSON.parse(JSON.stringify(chats)),
    },
  };
}

export default Chat;
