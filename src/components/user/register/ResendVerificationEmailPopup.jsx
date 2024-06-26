import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './resendVerificationEmailPopup.css';

function ResendVerificationEmailPopup({ onClose }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResend = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/resend_verification_email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const text = await response.text(); // Get the raw response as text
      console.log("Raw server response:", text);

      const result = JSON.parse(text); // Attempt to parse the text as JSON
      console.log("Parsed server response:", result);

      if (result.success) {
        setMessage(result.message);
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error("Error during resending verification email:", error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="popup__resend">
      <div className="popup__resend-content">
        <button className="close__resend" onClick={onClose}>X</button>
        <h2>Resend Verification Email</h2>
        <form onSubmit={handleResend}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit">Resend Email</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default ResendVerificationEmailPopup;
