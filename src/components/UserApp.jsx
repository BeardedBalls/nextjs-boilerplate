import React, { useEffect, useState } from 'react';
import UserDetails from './UserDetails';
import PaymentOptions from './PaymentOptions';
import { useNavigate } from 'react-router-dom';
import { browserLocalPersistence, setPersistence, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import './UserApp.css';

function UserApp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        navigate('/'); // Redirect to login page if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the subscription
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signOut(auth); // Sign out the user from Firebase
      navigate('/'); // Redirect to login page after signing out
    } catch (error) {
      console.error('Logout error:', error);
      // Handle logout error (e.g., show a message to the user)
    }
  };

  if (loading) return <p>Loading...</p>; // Show loading message while checking auth state

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
      </header>
      <div className="user-section">
        {authenticated ? <UserDetails /> : <p>User not authenticated.</p>}
      </div>
      <div className="payment-section">
        <PaymentOptions />
      </div>
      <button id='logout' onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default UserApp;
