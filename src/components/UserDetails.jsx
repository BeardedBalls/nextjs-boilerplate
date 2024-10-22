import React, { useEffect, useState } from 'react';
import { auth, firestore } from './firebaseConfig'; // Ensure correct import
import { collection, getDocs, query, where } from 'firebase/firestore';
import UserReceiptModal from './UserReceiptModal'; // Import the modal

function UserDetails() {
  const [user, setUser] = useState(null);
  const [clientData, setClientData] = useState([]); // State for client data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const currentUser = auth.currentUser; // Get the currently authenticated user

        if (currentUser) {
          const userEmail = currentUser.email; // Get the user's email

          // Query Firestore to find the user document with the matching email
          const userQuery = query(collection(firestore, 'Users'), where('email', '==', userEmail));
          const querySnapshot = await getDocs(userQuery);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data(); // Get the first user document
            setUser(userData); // Set the user state with the retrieved data

            // Fetch client data for all months using the user's meter number
            await fetchClientData(userData.meterNumber);
          } else {
            setError('No user found with the given email.'); // Handle case where no user is found
          }
        } else {
          setError('User not authenticated.'); // Handle case where user is not authenticated
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message); // Handle any errors during fetch
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    const fetchClientData = async (meterNumber) => {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const allClientData = [];

      for (const month of months) {
        const clientQuery = query(collection(firestore, `clients/Clients_${month}/Clients`), where('meterNumber', '==', meterNumber));
        const clientSnapshot = await getDocs(clientQuery);

        // Debugging: Log the query and the meter number used
        console.log(`Fetching clients for ${month} with meter number: ${meterNumber}`);

        clientSnapshot.forEach((doc) => {
          const clientInfo = doc.data();
          const previousReading = clientInfo.previousReading || 0; // Fallback to 0 if undefined
          const latestReading = clientInfo.latestReading || 0; // Fallback to 0 if undefined
          const amount = calculateAmount(previousReading, latestReading);

          allClientData.push({
            month,
            name: `${clientInfo.firstName} ${clientInfo.lastName}`,
            previousReading,
            latestReading,
            amount,
          }); // Add month info to each client's data
        });
      }

      setClientData(allClientData); // Set all client data for rendering
    };

    const calculateAmount = (previous, latest) => {
      const difference = latest - previous;
      return difference <= 10 ? 400 : difference * 0.1247 + 400; // Calculate amount
    };

    fetchUserData(); // Call the function to fetch user data
  }, []);

  const handleModalOpen = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
  };

  if (loading) return <p>Loading...</p>; // Display loading message
  if (error) return <p>{error}</p>; // Display error message

  return (
    <div className="user-details">
      <h2>User Details</h2>
      {user && (
        <>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
          <p><strong>Meter Number:</strong> {user.meterNumber}</p>
          <button onClick={handleModalOpen}>View Receipt</button> {/* Button to open modal */}
        </>
      )}

      {/* Table for displaying client data */}
      <h3>Client Data</h3>
      {clientData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Name</th>
              <th>Previous Reading</th>
              <th>Latest Reading</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {clientData.map((client, index) => (
              <tr key={index}>
                <td>{client.month}</td>
                <td>{client.name}</td>
                <td>{client.previousReading}</td>
                <td>{client.latestReading}</td>
                <td>{client.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No client data found for this user.</p>
      )}

      {/* Render the modal if it's open */}
      {isModalOpen && <UserReceiptModal user={user} onClose={handleModalClose} />}
    </div>
  );
}

export default UserDetails;
