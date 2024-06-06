import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PasswordInput from '../password/PasswordInput';
import ResendVerificationEmailPopup from './ResendVerificationEmailPopup'; // Import the new component
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
  const [showPopup, setShowPopup] = useState(false); // Add state for showing the popup

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
    return hasLowerCase(password) && hasUpperCase(password) && hasDigit(password) && hasSpecialChar(password) && hasMinLength(password);
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
            <div className="Reg__buttons">
              <button className='Reg__btn btn-primary' type='submit'>Register</button>
              <button type="button" className='Reg__btn btn-secondary' onClick={() => setShowPopup(true)}>Resend Verification Email</button>
            </div>
          </form>
        </div>
      </div>
      {showPopup && <ResendVerificationEmailPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}

export default Register;
