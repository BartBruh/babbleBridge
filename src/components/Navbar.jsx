import { signOut } from 'firebase/auth'
import React, { useContext, useEffect } from 'react'
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';

function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    console.log(currentUser);
  }, []);
  
  const handleLogout = async () => {
    await signOut(auth);
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div className='navbar'>
      <span className="logo">BabbleBridge</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button type='button' className='btn btn-secondary' onClick={handleLogout} id='logoutBtn'>Logout</button>
      </div>
    </div>
  )
}

export default Navbar