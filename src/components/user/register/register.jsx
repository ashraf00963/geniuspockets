import { useState } from 'react';
import './register.css';

function Register() {
    const [fName, setFname] = useState('');
    const [lName, setLname] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [success, setSuccess] = useState(null);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPass) {
            setError("Passwords do not match");
            return;
        }

        const data = {
            fName,
            lName,
            userName,
            email,
            password,
        };

        try {
            const response = await fetch('/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result.success) {
                setSuccess(result.message);
                setError(null);
            } else {
                setError(result.message);
                setSuccess(null);
            }
        } catch (error) {
            setError("An error occurred. Please try again later.");
            setSuccess(null);
        }
    };

    return (
        <div className='Reg__form container'>
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className='Reg__inputs'>
                    <div className='Reg__inputs-name'>
                        <input type='text' value={fName} onChange={(e) => setFname(e.target.value)} placeholder='First Name' required />
                        <input type='text' value={lName} onChange={(e) => setLname(e.target.value)} placeholder='Last Name' required />
                    </div>
                    <input type='text' value={userName} onChange={(e) => setUserName(e.target.value)} placeholder='Username' required />
                    <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' required />
                    <div className='Reg__inputs-password'>
                        <div className="password-input-container">
                            <input
                              type={passwordVisible ? 'text' : 'password'}
                              className="password-input-field"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Password"
                              required
                            />
                            <i
                              className={`password-toggle-icon ${
                                passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'
                              }`}
                              onClick={togglePasswordVisibility}
                            ></i>
                        </div>
                        <input type='password' value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder='Confirm Password' required />
                    </div>
                </div>
                <button type='submit'>Register</button>
            </form>
        </div>
    );
}

export default Register;
