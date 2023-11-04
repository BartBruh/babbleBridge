import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'

function Navbar() {
  const {currentUser} = useContext(AuthContext);
  
  const handleLogout = async () => {
    await signOut(auth);
  };
  
  return (
    <div className='navbar'>
      <span className="logo">GlotSync</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button type='button' className='btn btn-secondary' onClick={handleLogout} id='logoutBtn'>Logout</button>
      </div>
    </div>
  )
}

export default Navbar