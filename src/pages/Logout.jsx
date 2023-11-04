import { auth } from '../firebase';
import { signOut } from 'firebase/auth'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();
  useEffect(async () => {
    await signOut(auth);
    navigate('/login');
  }, [])
  return (
    <div>Logging out</div>
  )
}

export default Logout