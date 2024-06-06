import React, { useState } from 'react';
import 'register.css';
import axios from 'axios';

function ResendVerificationEmail() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://geniuspockets.com/resend_verification_email.php', { email });
      if (response.data.success) {
        setMessage('Verification email sent! Please check your email.');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      setMessage('Error resending verification email. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Resend Verification Email</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Resend Verification Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResendVerificationEmail;
