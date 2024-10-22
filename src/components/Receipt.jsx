import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import UserReceiptModal from './UserReceiptModal'; 
import PaymentModal from './PaymentModal'; 
import './Receipt.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons'; 
import { faReceipt } from '@fortawesome/free-solid-svg-icons'; // Add the receipt icon

const Payment = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'Users'));
        const userList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewBilling = (user) => {
    setSelectedUser(user);
    setIsPaymentModalOpen(true); 
  };

  const closeReceipt = () => {
    setIsReceiptOpen(false);
    setSelectedUser(null); 
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedUser(null); 
  };

  const handlePaymentSaved = () => {
    // If you want to handle anything specific after payment is saved
  };

  const openReceipt = (user) => {
    setSelectedUser(user); // Set the selected user for receipt
    setIsReceiptOpen(true); // Open the receipt modal
  };

  return (
    <div className="receipt-container">
      <h2>Payment Page</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a user..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <ul className="user-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <li key={user.id} className="user-item">
                <span>{user.firstName} {user.lastName}</span>
                <div className="tooltip-container">
                  <button
                    className="view-billing-btn"
                    onClick={() => handleViewBilling(user)}
                    aria-label={`View payment for ${user.firstName} ${user.lastName}`}
                  >
                    <FontAwesomeIcon icon={faFileInvoice} />
                    <span className="tooltip">Payment</span> {/* Tooltip for the button */}
                  </button>

                  <button
                    className="view-receipt-btn"
                    onClick={() => openReceipt(user)}
                    aria-label={`View receipt for ${user.firstName} ${user.lastName}`}
                  >
                    <FontAwesomeIcon icon={faReceipt} />
                    <span className="tooltip">View Receipt</span> {/* Tooltip for the button */}
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </ul>
      )}

      {isPaymentModalOpen && selectedUser && (
        <PaymentModal 
          user={selectedUser} 
          onClose={closePaymentModal} 
          onPaymentSaved={handlePaymentSaved} 
        />
      )}

      {isReceiptOpen && selectedUser && (
        <UserReceiptModal user={selectedUser}  onClose={closeReceipt} />
      )}
    </div>
  );
};

export default Payment;
