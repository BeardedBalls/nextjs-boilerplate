import React, { useState } from 'react';
import './UpdateReadingModal.css'; // CSS file for the modal styling
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

const UpdateReadingModal = ({ client, onClose, onSave, selectedMonth }) => {
    const [latestReading, setLatestReading] = useState(client.latestReading || 0);
    const [cubic, setCubic] = useState(client.cubic || 0);
    const [amount, setAmount] = useState(client.amount || 0);

    const calculateAmount = (cubic) => {
        const baseRate = 400;
        const additionalRate = 0.0447;
        const amount = cubic <= 10 ? baseRate : baseRate + ((cubic - 10)* additionalRate * baseRate);
        return parseFloat(amount.toFixed(2)); // Rounding to 2 decimal places
    };
    

    const handleSave = async () => {
        const updatedAmount = calculateAmount(cubic);
        const updatedClient = { 
            ...client, 
            latestReading, 
            cubic, 
            amount: updatedAmount 
        };

        // Save the updated reading and amount in Firestore
        await updateDoc(doc(firestore, `clients/Clients_${selectedMonth}/Clients`, client.id), {
            latestReading,
            cubic,
            amount: updatedAmount
        });

        onSave(updatedClient); // Pass updated client data to parent component
        onClose(); // Close the modal after saving
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Update Reading for {client.firstName} {client.lastName}</h2>
                <label>Latest Reading:</label>
                <input
                    type="number"
                    value={latestReading}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        setLatestReading(value);
                        setCubic(value - client.previousReading); // Calculate cubic automatically
                    }}
                />
                <label>Cubic:</label>
                <input
                    type="number"
                    value={cubic}
                    onChange={(e) => setCubic(Number(e.target.value))}
                    disabled // Cubic is automatically calculated, so it is disabled for manual input
                />
                <label>Amount:</label>
                <input
                    type="number"
                    value={amount}
                    disabled // Amount is automatically calculated
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default UpdateReadingModal;
