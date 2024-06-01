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
    const [passwordStrength, setPasswordStrength] = useState(0);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(String(password));
    };

    const calculatePasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score += 1; // At least 8 characters
        if (/[A-Z]/.test(password)) score += 1; // Uppercase letter
        if (/[a-z]/.test(password)) score += 1; // Lowercase letter
        if (/\d/.test(password)) score += 1; // Digit
        if (/[@$!%*?&]/.test(password)) score += 1; // Special character
        return score;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(calculatePasswordStrength(newPassword));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Invalid email format");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long and include at least one letter, one number, and one special character");
            return;
        }

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
        <div className='container'>
            <div className='Reg__form'>
                <div className='Reg__card card'>
                    <h2>Register</h2>
                    <div className='Reg__messages'>
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}
                    </div>
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
                                      onChange={handlePasswordChange}
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
                        <div className="password-strength-bar">
                            <div className={`strength-${passwordStrength}`}></div>
                        </div>
                        <button className='Reg__btn btn-primary' type='submit'>Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
