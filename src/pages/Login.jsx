import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

function Login() {
  const [err, setErr] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (ev) => {
    ev.preventDefault();
    const email = ev.target[0].value;
    const password = ev.target[1].value;

    try {
      signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setErr(true);
    }
  }
  
  return (
    <div className='formContainer'>
      <div className="formWrapper">
        <span className="logo">GlotSync - Speak Globally, Chat Locally</span>
        <span className="title">Login</span>
        <form onSubmit={handleLogin}>
          <div className="form-floating">
            <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" />
            <label htmlFor="floatingEmail">Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control" id="floatingPassword" placeholder="password" />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button className="btn btn-primary">Log In</button>
          { err && <span>Something went wrong</span> }
          <p>
            Don't have an account?&nbsp;
            <Link to='/register'>Register</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login