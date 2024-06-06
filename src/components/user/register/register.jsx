import { useState } from 'react';
import { Link } from 'react-browser-router';
import PasswordInput from '../password/PasswordInput';
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

    const hasLowerCase = (str) => /[a-z]/.test(str);
    const hasUpperCase = (str) => /[A-Z]/.test(str);
    const hasDigit = (str) => /\d/.test(str);
    const hasSpecialChar = (str) => /[!@#$%^&*(),.?":{}|<>]/.test(str);
    const hasMinLength = (str) => str.length >= 8;

    const validatePassword = (password) => {
        console.log("Validating password:", password);
        const valid = hasLowerCase(password) && hasUpperCase(password) && hasDigit(password) && hasSpecialChar(password) && hasMinLength(password);
        console.log(`Password valid: ${valid}`);
        console.log(`Lower case: ${hasLowerCase(password)}`);
        console.log(`Upper case: ${hasUpperCase(password)}`);
        console.log(`Digit: ${hasDigit(password)}`);
        console.log(`Special char: ${hasSpecialChar(password)}`);
        console.log(`Min length: ${hasMinLength(password)}`);
        return valid;
    };

    const calculatePasswordStrength = (password) => {
        let score = 0;
        if (hasMinLength(password)) score += 1; // At least 8 characters
        if (hasUpperCase(password)) score += 1; // Uppercase letter
        if (hasLowerCase(password)) score += 1; // Lowercase letter
        if (hasDigit(password)) score += 1; // Digit
        if (hasSpecialChar(password)) score += 1; // Special character
        return score;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(calculatePasswordStrength(newPassword));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");

        if (!validateEmail(email)) {
            setError("Invalid email format");
            console.log("Invalid email format");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long and include at least one letter, one number, and one special character");
            console.log("Password does not meet criteria");
            return;
        }

        if (password !== confirmPass) {
            setError("Passwords do not match");
            console.log("Passwords do not match");
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

            console.log("Server response:", response);

            const result = await response.json();
            console.log("Server result:", result);

            if (result.success) {
                setSuccess(result.message);
                setError(null);

                // Clear the form fields
                setFname('');
                setLname('');
                setUserName('');
                setEmail('');
                setPassword('');
                setConfirmPass('');
            } else {
                setError(result.message);
                setSuccess(null);
            }
        } catch (error) {
            setError("An error occurred. Please try again later.");
            setSuccess(null);
            console.log("Error during registration:", error);
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
                                    <PasswordInput password={password} setPassword={setPassword} confirmPass={confirmPass} setConfirmPass={setConfirmPass} />
                                </div>
                            </div>
                        </div>
                        <Link to='/resend-verification'>resend verification email</Link>
                        <button className='Reg__btn btn-primary' type='submit'>Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
