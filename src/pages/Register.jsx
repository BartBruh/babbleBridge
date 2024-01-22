import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, updateDoc } from "firebase/firestore";

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

    if (!username || !email || !password) {
      setErrMessage("Please fill username, email and password!");
      setErr(true);
      return;
    }

    if (!displayPicture) {
      setErrMessage("Please upload a display picture!");
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

    if (displayPicture) {
      if (!displayPicture.type.includes("image")) {
        setErrMessage("Only an image can be uploaded as display picture");
        setErr(true);
        return;
      }

      if (displayPicture.size / 1024 > 500) {
        setErrMessage("Display Picture size should be less than 500KB");
        setErr(true);
        return;
      }
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      var displayPictureURL = "";

      if (displayPicture) {
        const storageRef = ref(storage, username);
        const uploadTask = uploadBytesResumable(storageRef, displayPicture);

        try {
          uploadTask.on(
            (error) => {
              console.log("Error: " + error);
              setErr(true);
              setErrMessage(error.message);
            },
            async () => {
              console.log("display picture upload success");

              // getDownloadURL(uploadTask.snapshot.ref)
              //   .then(async downloadURL => {
              //     displayPictureURL = downloadURL;

              //     await updateProfile(res.user, {
              //       photoURL: downloadURL
              //     })

              //     await updateDoc(doc(db, "users", res.user.uid), {
              //       photoURL: downloadURL
              //     });
              //   });

              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              displayPictureURL = downloadURL;

              await updateProfile(res.user, {
                photoURL: downloadURL
              })
              console.log("profile picture link updated in user profile");

              await updateDoc(doc(db, "users", res.user.uid), {
                photoURL: downloadURL
              });
              console.log("profile picture link updated in users collection");
            }
          );

        } catch (error) {
          setErr(true);
          setErrMessage(error.message);
          console.log("Display picture upload error: " + error.message);
        }
      }

      await updateProfile(res.user, {
        displayName: username,
        // photoURL: displayPictureURL
      })
      // console.log("username and display picture link added to user profile");
      console.log("username updated in user profile");

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        username,
        email,
        language: navigator.language.split('-')[0]
        // photoURL: displayPictureURL,
      });
      console.log("user info added to users collection");

      await setDoc(doc(db, "userChats", res.user.uid), {})

      console.log("account created successfully");
      setUserCreated(true);
      setErr(false);
    } catch (error) {
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
        <p className="title">Register</p>
        <form onSubmit={handleSubmit}>
          <div className="form-floating">
            <input type="text" className="form-control" id="floatingUsername" placeholder="Username" ref={input => input && input.focus()} />
            <label htmlFor="floatingUsername">Username <span className="requiredFieldSymbol">*</span></label>
          </div>
          <div className="form-floating">
            <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" />
            <label htmlFor="floatingEmail">Email address <span className="requiredFieldSymbol">*</span></label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control" id="floatingPassword" placeholder="password" />
            <label htmlFor="floatingPassword">Password <span className="requiredFieldSymbol">*</span></label>
          </div>
          <div className="form-floating">
            <input type="file" accept='image/*' className="form-control" id="floatingDisplayPicture" placeholder="Display Picture" />
            <label htmlFor="floatingDisplayPicture">
              <span className="fa-solid fa-image"></span>
              &nbsp;
              Add an avatar <span className="requiredFieldSymbol">*</span></label>
          </div>
          <p className='requiredFieldsInfo'><span className="requiredFieldSymbol">*</span> - Required fields</p>
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