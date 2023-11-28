import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';

const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

function Message({ message }) {
  const { currentUser } = useContext(AuthContext);
  const { activeChatInfo } = useContext(ChatContext);

  const showTranslationInfo = message && message.translatedText && message.text !== message.translatedText;

  const ref = useRef();

  const senderProfileImageSrc = message
    ? (message.senderId === currentUser.uid ? currentUser.photoURL : activeChatInfo.otherUserInfo.photoURL)
    : "";

  useEffect(() => {
    if (message)
      ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <>
      {message && (message.img || message.text) &&
        <div ref={ref} className={`message ${message.senderId === currentUser.uid ? 'owner' : ""}`}>
          <div className="messageInfo">
            {
              senderProfileImageSrc
                ? <img src={senderProfileImageSrc} alt="" />
                : <i className="fa-solid fa-user"></i>
            }
            <span className="messageDateTime">
              <p>{message.date.toDate().toDateString().slice(4, 10)}</p>
              <p>{message.date.toDate().toTimeString().slice(0, 5)}</p>
            </span>
          </div>
          <div className="messageContent">
            {
              message.text &&
              <div className="messageTextContainer">
              {
                message.text &&
                <div className="originalMessageContainer">
                  {
                    message.translationInfo &&
                    showTranslationInfo &&
                    <p className="translationInfo">Detected: {languageNames.of(message.translationInfo.detected)}</p>
                  }
                  {message.text &&
                    <p className="messageText">{message.text}</p>}
                </div>}
              {
                message.translationInfo &&
                showTranslationInfo &&
                <div className="translatedMessageContainer">
                  <p className="translationInfo">Translated to: {languageNames.of(message.translationInfo.translatedTo)}</p>
                  <p className="messageText">{message.translatedText}</p>
                </div>}
            </div>}

            {message.img && <img src={message.img} alt="" />}
          </div>
        </div>}
    </>
  )
}

export default Message