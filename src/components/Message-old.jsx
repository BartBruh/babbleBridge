import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';

// function Message({ message, animate }) {
function Message({ message, typingAnimation }) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });

    if (typingAnimation) {
      
    }
    
  }, [message]);

  if (typingAnimation) {
    return <></>
  }

  return (
    <>
      {(message.img || message.text) &&
        <div ref={ref} className={`message ${message.senderId === currentUser.uid ? 'owner' : ""}`}>
          <div className="messageInfo">
            <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}
              alt="" />
            <span className="messageDateTime">
              <p>{message.date.toDate().toDateString().slice(4, 10)}</p>
              <p>{message.date.toDate().toTimeString().slice(0, 5)}</p>
            </span>
          </div>
          <div className="messageContent">
            {message.text && <p>{message.text}</p>}
            {message.img && <img src={message.img} alt="" />}
            {/* {animate && <p className="messageBottom">message is animateed</p>} */}
          </div>
        </div>}
    </>
  )
}

export default Message