import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './identify.css';

function Identify() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/forgot-password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Password reset email sent. Please check your inbox.');
                setEmailSent(true);

                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error sending password reset email.');
        }
    };

    return (
        <div className="identify__container">
            <h2>Forgot Password</h2>
            {!emailSent ? (
                <form onSubmit={handleSubmit} className="identify__form">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email address'
                        required
                    />
                    <button type="submit">Send Reset Link</button>
                </form>
            ) : (
                <p className="identify__message">{message}</p>
            )}
        </div>
    );
}

export default Identify;
