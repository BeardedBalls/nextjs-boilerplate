/* eslint-disable no-unused-vars */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { browserLocalPersistence, setPersistence } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Adjust the import path as needed
import './SidePanel.css'; // Import the CSS file

const SidePanel = () => {
  const navigate = useNavigate(); // For navigation after logout

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

  return (
    <div className="side-panel">
      <img src="/Logo.png" alt="" />
      <Link to="/admin/dashboard">
        <button>Dashboard</button>
      </Link>
      <Link to="/admin/client">
        <button>Client</button>
      </Link>
      <Link to="/admin/receipt">
        <button>Receipt</button>
      </Link>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default SidePanel;
