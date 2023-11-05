import React, { useContext, useEffect, useState } from 'react'
import Message from "./Message";
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

function Messages() {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    }
  }, [data.chatId]);

  return (
    <div className='messages'>
      {
        messages.map((message, index) => (
          <Message key={index} message={message} animate={index === messages.length - 1 && message.senderId !== currentUser.uid} />
        ))
      }
    </div>
  )
}

export default Messages