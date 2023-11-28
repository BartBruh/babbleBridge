import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';

function Message({ message }) {
  const { currentUser } = useContext(AuthContext);
  const { activeChatInfo } = useContext(ChatContext);

  const ref = useRef();

  // function startTypingAnimation() {
  //   const text = "Drop Your AI-Written Content Below And See The Magic 😎;";
  //   const typingText = document.getElementById("typing-effect");
  //   let index = 0;

  //   function type() {
  //     if (index < text.length) {
  //       typingText.innerHTML += text.charAt(index);
  //       index++;
  //       setTimeout(type, 100);
  //     }
  //   }

  //   type();
  // }

  const [currentText, setCurrentText] = useState("");
  const [index, setIndex] = useState(0);

  const typingAnimation = () => {
    console.log("in typing animation")
    const type = () => {
      console.log("in type");
      if (index < message.text.length) {
        setCurrentText(currentText + message.text.charAt(index));
        setIndex(index + 1);
        setTimeout(type, 100);
        console.log(index);
      }
    }
    console.log("after type");
    type();
  }


  useEffect(() => {
    console.log("in useEffect");

    ref.current?.scrollIntoView({ behavior: "smooth" });

    typingAnimation();

  }, [message]);

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
      <div className="messageInfo">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : activeChatInfo.otherUserInfo.photoURL}
          alt="" />
        <span>{message.date.toDate().toDateString().slice(4, 10)}</span>
        <span>{message.date.toDate().toTimeString().slice(0, 5)}</span>
      </div>
      <div className="messageContent">
        <p>{currentText}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  )
}

export default Message