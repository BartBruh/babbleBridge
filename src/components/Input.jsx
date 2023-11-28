import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

function Input() {
  const translatorAPIKey = "5c8ced24368c45778e46e3e0358fc4d6";

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { activeChatInfo } = useContext(ChatContext);

  const otherUserLanguage = activeChatInfo.otherUserInfo.language ? activeChatInfo.otherUserInfo.language : "en";

  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  let lastTyped = null;

  // const [lastTyped, setLastTyped] = useState(null);

  const updateLastTyped = () => {
    // setLastTyped(serverTimestamp());
    lastTyped = serverTimestamp();
    console.log("updating last typed");
    updateDoc(doc(db, "userChats", currentUser.uid), {
      [activeChatInfo.chatId + ".lastTyped.by"]: currentUser.uid,
      [activeChatInfo.chatId + ".lastTyped.at"]: lastTyped
    });
    updateDoc(doc(db, "userChats", activeChatInfo.otherUserInfo.uid), {
      [activeChatInfo.chatId + ".lastTyped.by"]: currentUser.uid,
      [activeChatInfo.chatId + ".lastTyped.at"]: lastTyped
    });
  }

  const handleTextInputChange = (e) => {
    setText(e.target.value);
    setErr(false);

    if (serverTimestamp() - lastTyped > 3000)
      updateLastTyped();
  }

  const handleSend = async () => {
    if (!text && !img) {
      setErr(true);
      setErrMessage("Please enter text or select an image to send");
      return;
    }

    if (img && !img.type.includes("image")) {
      setErr(true);
      setErrMessage("File can only be an image");
      setImg(null);
      return;
    }

    if (img && img.size / 1024 > 500) {
      setErr(true);
      setErrMessage("Image size should be less than 500KB");
      setImg(null);
      return;
    }

    try {
      let translatedText = "";
      let translationInfo = null;

      try {
        if (text) {
          // translating text to other user's language using Azure Translator
          const response = await fetch("https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=" + otherUserLanguage, {
            method: "POST",
            headers: {
              "Ocp-Apim-Subscription-Key": translatorAPIKey,
              "Content-Type": "application/json"
            },
            body: JSON.stringify([{ Text: text }])
          });
          const result = await response.json();
          console.log(result);

          translatedText = result[0].translations[0].text;
          translationInfo = {
            detected: result[0].detectedLanguage.language,
            translatedTo: otherUserLanguage,
            score: result[0].detectedLanguage.score
          };

          console.log("translated text: " + translatedText);
        }
      } catch (error) {
        console.log("Translation Error: " + error);
        setErr(true);
        setErrMessage(error.message);
      }

      console.log("adding message to db");
      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);
        uploadTask.on(
          (error) => {
            console.log("Error: " + error);
            setErr(true);
            setErrMessage(error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await updateDoc(doc(db, "chats", activeChatInfo.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  translatedText,
                  translationInfo,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL
                })
              });
            });
          }
        );
      } else {
        // console.log("inside text without image block");
        console.log("translated text before adding to db: " + translatedText);
        await updateDoc(doc(db, "chats", activeChatInfo.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            translatedText,
            translationInfo,
            senderId: currentUser.uid,
            date: Timestamp.now()
          })
        });
        // console.log("updated text without image");
      }
      console.log("added message to db");

      // console.log("adding last message and timestamp");
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [activeChatInfo.chatId + ".lastMessage"]: { text: text ? text : "Image" },
        [activeChatInfo.chatId + ".date"]: serverTimestamp()
      });
      await updateDoc(doc(db, "userChats", activeChatInfo.otherUserInfo.uid), {
        [activeChatInfo.chatId + ".lastMessage"]: { text: text ? text : "Image" },
        [activeChatInfo.chatId + ".date"]: serverTimestamp()
      });
      // console.log("added last message and timestamp");
    } catch (error) {
      console.log("Error: " + error);
      setErrMessage(error.message);
      setErr(true);
    }

    setText("");
    setImg(null);
  }

  return (
    <div className='input'>
      {err && errMessage && !text && <p className="err">{errMessage}</p>}
      <input type="text"
        placeholder='Type something...'
        onChange={handleTextInputChange}
        value={text}
        onKeyDown={e => e.key === "Enter" && handleSend()}
        ref={input => input && input.focus()}
      />
      <div className="send">
        <input type="file"
          accept='image/*'
          style={{ display: 'none' }}
          name="" id="file"
          onChange={e => { setImg(e.target.files[0]); setErr(false); }} />
        <label htmlFor="file">
          <span className="fa-solid fa-image"></span>
        </label>
        <button onClick={handleSend} className='btn btn-primary'>Send</button>
      </div>
    </div>
  )
}

export default Input