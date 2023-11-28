import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { ChatContext } from '../context/ChatContext';
import { OpenSidebarContext } from '../context/OpenSidebarContext';

function Chats() {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const { setOpenSidebar } = useContext(OpenSidebarContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
        // console.log("chats updated: " + chats);
      });

      return () => {
        unsub();
      }
    }
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (otherUserInfo) => {
    console.log("user selected: " + otherUserInfo.username);
    console.log(JSON.parse(JSON.stringify(otherUserInfo)))
    setOpenSidebar(false);
    dispatch({
      type: "CHANGE_USER",
      payload: otherUserInfo
    })
  }

  return (
    <div className='chats'>
      {
        chats && Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map(chat => (
          <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
            {
              chat[1].userInfo.photoURL
                ? <img src={chat[1].userInfo.photoURL} alt="" />
                : <i className="fa-solid fa-user"></i>
            }
            <div className="userChatInfo">
              <p className='name'>{chat[1].userInfo?.username}</p>
              <p className='lastName'>{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default Chats