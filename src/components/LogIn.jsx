import React, { useState } from 'react';
import { auth } from './firebaseConfig'; // Adjust import path as needed
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './LogIn.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState(''); // For password reset
  const [showReset, setShowReset] = useState(false); // To toggle reset form
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User:', user);
      if(user.email === 'dwsmpc@gmail.com'){
        navigate('/admin');
      }
      else{
        navigate('/userapp')
      }
      
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = () => {
    navigate('/register'); // Navigate to the Register page
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setError('Please enter your email');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setError('Password reset email sent!');
      setShowReset(false); // Hide the reset form after success
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container1">
      <img src="/Logo.png" alt="" />
      <form onSubmit={handleSubmit} className="form1">
        <h2 className="header1">Login</h2>
        {error && <p className="error">{error}</p>}
        {!showReset ? (
          <>
            <div className="inputContainer">
              <label htmlFor="email" className="label">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>
            <div className="inputContainer">
              <label htmlFor="password" className="label">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </div>
            <a
              href="#"
              className="forgot-password-link"
              onClick={(e) => {
                e.preventDefault();
                setShowReset(true);
              }}
            >
              Forgot Password?
            </a>
            <button type="submit" className="button">Login</button>
            <button type="button" className="button" onClick={handleRegister}>Register</button>
          </>
        ) : (
          <>
            <div className="inputContainer">
              <label htmlFor="resetEmail" className="label">Enter your email:</label>
              <input
                type="email"
                id="resetEmail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="input"
              />
            </div>
            <button type="button" className="button" onClick={handleResetPassword}>
              Reset Password
            </button>
            <a
              href="#"
              className="forgot-password-link"
              onClick={(e) => {
                e.preventDefault();
                setShowReset(false);
              }}
            >
              Back to Login
            </a>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;