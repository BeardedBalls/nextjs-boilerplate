import React from 'react';
import './BillingModal.css'; // Add your modal styling here

const BillingModal = ({ client, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Billing Details for {client.lastName} {client.firstName}</h2>
        <div>
          <p>Meter No: {client.meterNumber}</p>
          <p>Previous Reading: {client.previousReading}</p>
          <p>Latest Reading: {client.latestReading}</p>
          <p>Cubic Meter Consumed: {client.cubic}</p>
          <p>Amount: {client.amount}</p>
          <p>Arrears: {client.arrears}</p>
        </div>
      </div>
    </div>
  );
};

export default BillingModal;
