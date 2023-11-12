import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';

// function Message({ message, animate }) {
function Message({ message, typingAnimation }) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  const [animationText, setAnimationText] = useState("");

  useEffect(() => {
    if (message)
      ref.current?.scrollIntoView({ behavior: "smooth" });

    if (typingAnimation) {
      const interval = setInterval(() => {
        setAnimationText((prev) => {
          if (prev.length >= 3) {
            return "";
          }
          return prev + "•";
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [message, animationText]);


  if (typingAnimation) {
    return (
      <div ref={ref} className={`message animation-text`}>
        <div className="messageInfo">
          <img src={data.user.photoURL}
            alt="" />
        </div>
        <div className="messageContent">
          <p>{animationText}</p>
        </div>
      </div>
    )
  }
  
  return (
    <>
      {message && (message.img || message.text) &&
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