import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SidePanel from './SidePanel';
import Dashboard from './Dashboard';
import Client from './Client';
import Receipt from './Receipt';
import Profile from './Profile';
import './Admin.css'; // Import the CSS file

function Admin() {
  return (
    <div className="admin-container">
      <div className="side-panel">
        <SidePanel />
      </div>
      <div className="content">
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/client" element={<Client />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
