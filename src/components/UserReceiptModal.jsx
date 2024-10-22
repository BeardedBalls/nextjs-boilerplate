import React, { useState } from 'react';
import './UserReceiptModal.css'; // Import the CSS file
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Firebase Firestore import

const UserReceiptModal = ({ user, onClose }) => {
  const [previousReading, setPreviousReading] = useState('');
  const [latestReading, setLatestReading] = useState(''); // Changed to latestReading
  const [amount, setAmount] = useState(''); // Fetch stored amount
  const [selectedDate, setSelectedDate] = useState(''); // To store the selected date

  const db = getFirestore(); // Initialize Firestore

  const handleDateChange = async (e) => {
    const date = new Date(e.target.value);
    const month = date.toLocaleString('default', { month: 'long' });

    setSelectedDate(month);

    try {
      const receiptRef = doc(db, `clients/Clients_${month}/Clients`, user.id); 
      const receiptSnap = await getDoc(receiptRef);

      if (receiptSnap.exists()) {
        const receiptData = receiptSnap.data();
        
        setPreviousReading(receiptData.previousReading || 'N/A'); // Fetch previous reading
        setLatestReading(receiptData.latestReading || 'N/A'); // Fetch latest reading
        setAmount(receiptData.amount || 'N/A'); // Fetch amount

      } else {
        console.log("No receipt data for this user and month!");
        setPreviousReading('N/A');
        setLatestReading('N/A');
        setAmount('N/A');
      }
    } catch (error) {
      console.error("Error fetching receipt:", error);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h2 {
              text-align: center;
            }
            .receipt {
              border: 1px solid #ccc;
              padding: 20px;
              border-radius: 5px;
              width: 100%;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <h2>Receipt for ${user.firstName} ${user.lastName}</h2>
            <p><strong>Previous Reading:</strong> ${previousReading}</p>
            <p><strong>Latest Reading:</strong> ${latestReading}</p>
            <p><strong>Amount:</strong> ${amount}</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close(); // Close the document
    printWindow.focus(); // Focus on the new window
    printWindow.print(); // Print the content
    printWindow.close(); // Close the print window after printing
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Receipt for {user.firstName} {user.lastName}</h2>
        <div id="receipt-content">
          <form>
            <div>
              <label>Select Date:</label>
              <input
                type="month"
                onChange={handleDateChange}
                required
              />
            </div>
            <div>
              <label>Previous Reading:</label>
              <p>{previousReading || '0'}</p> {/* Display previous reading */}
            </div>
            <div>
              <label>Latest Reading:</label>
              <p>{latestReading || 'N/A'}</p> {/* Display latest reading */}
            </div>
            <div>
              <label>Amount:</label>
              <p>{amount || 'N/A'}</p> {/* Display amount */}
            </div>
            <button type="button" onClick={handlePrint}>Print Receipt</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserReceiptModal;
