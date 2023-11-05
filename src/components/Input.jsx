import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

function Input() {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const handleSend = async () => {
    if (!text && !img) {
      setErr(true);
      setErrMessage("Please enter text or select an image to send");
      return;
    }

    try {
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
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
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
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now()
          })
        });
        // console.log("updated text without image");
      }

      // console.log("adding last message timestamp");
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: { text },
        [data.chatId + ".date"]: serverTimestamp()
      });
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: { text },
        [data.chatId + ".date"]: serverTimestamp()
      });
      // console.log("added last message timestamp");
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
        onChange={e => { setText(e.target.value); setErr(false); }}
        value={text}
        onKeyDown={e => e.key === "Enter" && handleSend()}
      />
      <div className="send">
        <input type="file" style={{ display: 'none' }} name="" id="file" onChange={e => setImg(e.target.files[0])} />
        <label htmlFor="file">
          <span className="fa-solid fa-image"></span>
        </label>
        <button onClick={handleSend} className='btn btn-primary'>Send</button>
      </div>
    </div>
  )
}

export default Input