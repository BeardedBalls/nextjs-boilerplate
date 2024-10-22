import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import './Table.css';

function Table({ selectedMonth, setTotalAmount }) {
  const [payments, setPayments] = useState([]);
  const db = getFirestore(); // Initialize Firestore

  // Helper function to convert month number to month name
  const getMonthName = (month) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1];
  };

  useEffect(() => {
    const fetchPayments = async () => {
      const monthName = getMonthName(selectedMonth); // Convert selected month to month name

      try {
        // Reference to the collection based on the selected month
        const paymentsRef = collection(db, `Payments/Payment_${monthName}/Payments`);

        // Get all documents (payments) from the collection
        const paymentsSnapshot = await getDocs(paymentsRef);
        
        const paymentData = paymentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPayments(paymentData); // Set payments data

        // Calculate total amount
        const total = paymentData.reduce((sum, payment) => {
          return sum + (payment.amount || 0); // Ensure amount is a number
        }, 0);
        setTotalAmount(total); // Set the total amount
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, [db, selectedMonth]); // Run effect when selectedMonth changes

  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>OR Number</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.name}</td>
              <td>Php. {payment.amount.toLocaleString()}</td>
              <td>{payment.orNumber || 'N/A'}</td> {/* Default to 'N/A' if OR number doesn't exist */}
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>No payments for this month.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
