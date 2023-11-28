import React, { useContext, useEffect, useRef, useState } from 'react'
// import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';
// import { doc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
// import { db } from '../firebase';

function TypingAnimationMessage() {
  // const { currentUser } = useContext(AuthContext);
  const { activeChatInfo } = useContext(ChatContext);

  const ref = useRef();

  const [animationText, setAnimationText] = useState("");

  // const [showAnimation, setShowAnimation] = useState(false);

  // let showAnimation = false;

  // showing typing animation when other user is typing,
  // and hiding it when they are not
  // useEffect(() => {
  //   const unSub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
  //     if (doc.exists()) {
  //       console.log(doc.date());
  //       const lastTypedBy = doc.data()[activeChatInfo.chatId].lastTyped.by;
  //       const lastTypedAt = doc.data()[activeChatInfo.chatId].lastTyped.at;
  //       if ((lastTypedBy !== currentUser.uid) && (serverTimestamp() - lastTypedAt < 3000)) {
  //         // setAnimationText("");
  //         // showAnimation = true;
  //         setShowAnimation(true);
  //       }
  //     }
  //   });

  //   return () => {
  //     unSub();
  //   }
  // }, [activeChatInfo.chatId, currentUser.uid]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationText((prev) => {
        if (prev.length >= 3) {
          return "";
        }
        return prev + "•";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [animationText]);

  return (
    // showAnimation &&
    <div ref={ref} className={`message animation-text`}>
      <div className="messageInfo">
        <img src={activeChatInfo.otherUserInfo.photoURL}
          alt="" />
      </div>
      <div className="messageContent">
        <p>{animationText}</p>
      </div>
    </div>
  )
}

export default TypingAnimationMessage