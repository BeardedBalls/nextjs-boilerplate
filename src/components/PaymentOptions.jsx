import React, { useState } from 'react';

function PaymentOptions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Your backend endpoint for processing GCash payments
  const backendPaymentUrl = "http://localhost:3000/maya/payment"; // Replace with your actual backend URL

  const handlePaymentClick = async () => {
    setLoading(true);
    setError('');
    setPaymentSuccess(false);

    const paymentData = {
      // Populate this with the necessary payment details
      amount: {
        value: 1000, // Example amount in PHP cents (1000 = 10.00 PHP)
        currency: "PHP"
      },
      // Other payment-related details can be added here
    };

    try {
      const response = await fetch(backendPaymentUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Handle successful payment response
        setPaymentSuccess(true);
        // Redirect to the GCash payment URL if needed
        window.location.href = responseData.paymentUrl; // Assuming your backend returns a payment URL
      } else {
        // Handle error response
        setError(responseData.message || 'Payment failed. Please try again.');
      }
    } catch (error) {
      setError('Error making payment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-options">
      <h2>Payment Options</h2>
      {loading && <p>Processing payment...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {paymentSuccess && <p style={{ color: 'green' }}>Payment successful!</p>}
      <button onClick={handlePaymentClick} className="gcash-button" disabled={loading}>
        Pay with GCash
      </button>
    </div>
  );
}

export default PaymentOptions;
