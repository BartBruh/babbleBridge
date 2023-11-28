import React, { useContext, useEffect, useState } from 'react'
import Message from "./Message";
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import TypingAnimationMessage from './TypingAnimationMessage';

function Messages() {
  const [messages, setMessages] = useState([]);
  const { activeChatInfo } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", activeChatInfo.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    }
  }, [activeChatInfo.chatId]);

  return (
    <div className='messages'>
      {
        messages.map((message, index) => (
          <Message key={index} message={message} />
        ))
      }
      <TypingAnimationMessage />
    </div>
  )
}

export default Messages