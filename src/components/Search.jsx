import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useState } from 'react'
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

function Search() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const { dispatch } = useContext(ChatContext);


  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", username));
    console.log("handling search");

    try {
      const querySnapshot = await getDocs(q);
      let found = false;
      querySnapshot.forEach((doc) => {
        found = true;
        setUser(doc.data());
        console.log("found searched user")
      });
      if (!found) {
        setUser(null);
        setErr(true);
        console.log("searched user not found")
      } else {
        setErr(false);
      }
    } catch (err) {
      console.log("Error: " + err);
      setErr(true);
    }
  }

  const handleKey = e => {
    e.code === "Enter" && handleSearch();
  }

  const handleSelect = async () => {
    console.log("selected searched user");
    // check whether the group (chats in firestore) exists
    // if not, create new
    const combinedId = currentUser.uid > user.uid ? user.uid + currentUser.uid : currentUser.uid + user.uid;
    console.log(combinedId);
    try {
      console.log("in try block")
      const res = await getDoc(doc(db, "chats", combinedId));
      console.log(res);

      if (!res.exists()) {
        // create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        console.log("set combined name doc in chats")

        // create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId + ".date"]: serverTimestamp()
        })
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedId + ".date"]: serverTimestamp()
        })
        console.log("created new chats for both users");
      }
    } catch (error) {
      console.log("Error: " + error);
      setErr(true);
    }
    dispatch({
      type: "CHANGE_USER",
      payload: user
    })
    setUser(null);
    setUsername("");
  }

  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text"
          placeholder='Search for users...'
          onKeyDown={handleKey}
          onChange={e => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <p className='errorText'>User not found!</p>}
      {user && <div className="userChat" onClick={handleSelect}>
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  )
}

export default Search