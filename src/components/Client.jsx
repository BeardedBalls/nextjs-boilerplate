import React, { useEffect, useState } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import ClientTable from './clientTable';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const Client = () => {
    const [clients, setClients] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]); // Default to current month
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchClients = async (month) => {
        const querySnapshot = await getDocs(collection(firestore, `clients/Clients_${month}/Clients`));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');

            try {
                const currentClients = await fetchClients(selectedMonth);
                setClients(currentClients);
            } catch (error) {
                setError('Error fetching data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedMonth]);

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleUpdateReading = async (updatedClient) => {
        const monthIndex = months.indexOf(selectedMonth);
        
        // Update the current month's client with the new latest reading
        const updatedClients = clients.map(client => 
            client.id === updatedClient.id ? { ...client, latestReading: updatedClient.latestReading, cubic: updatedClient.cubic } : client
        );

        setClients(updatedClients);

        // If the selected month is not January, move latest reading to next month
        if (monthIndex < 11) { // Ensure it doesn't exceed December
            const nextMonth = months[monthIndex + 1];
            const nextClientDoc = doc(firestore, `clients/Clients_${nextMonth}/Clients`, updatedClient.id);

            // Update the next month with the latest reading as previous reading and reset values for current month
            await setDoc(nextClientDoc, {
                previousReading: updatedClient.latestReading, // Set the current latest reading as the previous reading for the next month
                latestReading: 0, // Reset latest reading for current month
                cubic: 0, // Reset cubic for current month
                amount: 0 // Reset amount for current month
            }, { merge: true }); // Use merge to update only the fields provided
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <label htmlFor="month-select">Select Month: </label>
            <select id="month-select" value={selectedMonth} onChange={handleMonthChange}>
                {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                ))}
            </select>

            <ClientTable clients={clients} selectedMonth={selectedMonth} onUpdateReading={handleUpdateReading} />
        </div>
    );
};

export default Client;
