import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, deleteUser, updateProfile } from "firebase/auth";
import { auth, db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { deleteDoc, doc, setDoc } from "firebase/firestore";

function Register() {
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const [userCreated, setUserCreated] = useState(false);

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    setErr(false);
    setErrMessage("");
    setUserCreated(false);
    
    const username = ev.target[0].value.toLowerCase();
    const email = ev.target[1].value.toLowerCase();
    const password = ev.target[2].value;
    const displayPicture = ev.target[3].files[0];

    if (!username || !email || !password || !displayPicture) {
      setErrMessage("Please fill all the fields");
      setErr(true);
      return;
    }

    if (username.length < 3 || username.length > 15) {
      setErrMessage("Username should be between 3-15 characters");
      setErr(true);
      return;
    }
    if (username.includes(" ")) {
      setErrMessage("Username should not contain spaces");
      setErr(true);
      return;
    }

    if (!displayPicture.type.includes("image")) {
      setErrMessage("Please upload an image");
      setErr(true);
      return;
    }

    if (displayPicture.size / 1024 > 500) {
      setErrMessage("Image size should be less than 500KB");
      setErr(true);
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, username);
      const uploadTask = uploadBytesResumable(storageRef, displayPicture);

      uploadTask.on(
        (error) => {
          console.log("Error: " + error);
          setErr(true);
          setErrMessage(error.message);
        },
        async () => {
          console.log("display picture upload success");

          try {
            const dpDownloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            await updateProfile(res.user, {
              displayName: username,
              photoURL: dpDownloadURL
            })
            console.log("display picture link added to user profile");

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              username,
              email,
              photoURL: dpDownloadURL,
            });
            console.log("user info added to users collection");

            await setDoc(doc(db, "userChats", res.user.uid), {})

            console.log("account created successfully");
            setUserCreated(true);
            setErr(false);

          } catch (error) {

            // rollback user creation if any error occurs

            console.log("Error occurred in user creation so rolling back: " + error);
            
            setErrMessage("User creation failed");
            setErr(true);

            try {
              await deleteDoc(doc(db, "users", res.user.uid));
              console.log("deleted user document from 'users' collection");
            } catch (error) {
              console.log("Error in user document deletion from 'users' collection: " + error);
            }

            try {
              await deleteDoc(doc(db, "userChats", res.user.uid));
              console.log("deleted user document from 'userChats' collection");
            } catch (error) {
              console.log("Error in user document deletion from 'userChats' collection: " + error);
            }

            try {
              await deleteObject(storageRef);
              console.log("deleted user displayPicture from storage");
            } catch (error) {
              console.log("Error in user displayPicture deletion from storage: " + error);
            }

            try {
              await deleteUser(res.user);
              console.log("deleted user");
            } catch (error) {
              console.log("Error in user deletion: " + error);
            }

          }
        }
      );
    } catch (error) {
      setUserCreated(false);
      console.log("Error: " + error);
      setErrMessage(error.message);
      setErr(true);
    }
  }

  return (
    <div className='formContainer'>
      <div className="formWrapper">
        <span className="logo">
          <p id='logo-main'>
            BabbleBridge
          </p>
          <p id='logo-sub'>
            Connecting the World in Real-Time
          </p>
        </span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <div className="form-floating">
            <input type="text" className="form-control" id="floatingUsername" placeholder="Username" />
            <label htmlFor="floatingUsername">Username</label>
          </div>
          <div className="form-floating">
            <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" />
            <label htmlFor="floatingEmail">Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control" id="floatingPassword" placeholder="password" />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className="form-floating">
            <input type="file" accept='image/*' className="form-control" id="floatingDisplayPicture" placeholder="Display Picture" />
            <label htmlFor="floatingDisplayPicture">
              <span className="fa-solid fa-image"></span>
              &nbsp;
              Add an avatar</label>
          </div>
          <button className="btn btn-primary">Sign Up</button>
          {err && errMessage && <span>{errMessage}</span>}
          {userCreated &&
            <span>
              <b>User created successfully!
                <br />Please login now
              </ b>
            </span>}
          <p>Already have an account?&nbsp;
            <Link to='/login'>Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register