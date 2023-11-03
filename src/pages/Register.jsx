import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

function Register() {
  const [err, setErr] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const displayName = ev.target[0].value;
    const email = ev.target[1].value;
    const password = ev.target[2].value;
    const displayPicture = ev.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, displayPicture);

      uploadTask.on(
        (error) => {
          setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL
            })
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", res.user.uid), {})
            navigate("./");
          });
        }
      );
    } catch (error) {
      setErr(true);
    }
  }

  return (
    <div className='formContainer'>
      <div className="formWrapper">
        <span className="logo">GlotSync - Speak Globally, Chat Locally</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <div className="form-floating">
            <input type="text" className="form-control" id="floatingDisplayName" placeholder="Display Name" />
            <label htmlFor="floatingDisplayName">Display Name</label>
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
            <input type="file" className="form-control" id="floatingDisplayPicture" placeholder="Display Picture" />
            <label htmlFor="floatingDisplayPicture">
              <span className="fa-solid fa-image"></span>
              &nbsp;
              Add an avatar</label>
          </div>
          <button className="btn btn-primary">Sign Up</button>
          { err && <span>Something went wrong</span> }
          <p>Already have an account?&nbsp;
            <Link to='/login'>Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register