import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './UserCount.css';

function UserCount() {
  const [userCount, setUserCount] = useState(0);
  const db = getFirestore(); // Initialize Firestore

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const usersCollection = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersCollection);
        setUserCount(usersSnapshot.size); // Set user count based on the number of documents
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, [db]);

  return (
    <div className="user-count-container">
      <div className="user-count-label">Total Clients</div>
      <div className="user-count-number">{userCount}</div>
    </div>
  );
}

export default UserCount;
