import React, { useState } from 'react';
import './PasswordInput.css';

function PasswordInput({ password, setPassword, confirmPass, setConfirmPass }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const hasLowerCase = (str) => /[a-z]/.test(str);
    const hasUpperCase = (str) => /[A-Z]/.test(str);
    const hasDigit = (str) => /\d/.test(str);
    const hasSpecialChar = (str) => /[!@#$%^&*(),.?":{}|<>]/.test(str);
    const hasMinLength = (str) => str.length >= 8;

    const calculatePasswordStrength = (password) => {
        let score = 0;
        if (hasMinLength(password)) score += 1; // At least 8 characters
        if (hasUpperCase(password)) score += 1; // Uppercase letter
        if (hasLowerCase(password)) score += 1; // Lowercase letter
        if (hasDigit(password)) score += 1; // Digit
        if (hasSpecialChar(password)) score += 1; // Special character
        console.log("Password strength score:", score);
        return score;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(calculatePasswordStrength(newPassword));
    };

    return (
        <div>
            <div className='password-input-fields'>
                <div className='password-input-container'>
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
                    <div className="password-strength-bar">
                        <div className={`strength strength-${passwordStrength}`}></div>
                    </div>
                </div>
                <input type='password' value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder='Confirm Password' required />
            </div>
            
        </div>
    );
}

export default PasswordInput;
