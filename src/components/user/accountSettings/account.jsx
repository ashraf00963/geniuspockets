import { useState, useEffect } from 'react';
import './account.css';
import PasswordInput from '../password/PasswordInput';

function AccountSettings() {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
    });
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        // Fetch user profile data
        fetch('/profile.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    setProfile(data.data);
                } else {
                    setMessage(data.message);
                }
            })
            .catch(error => setMessage(`Error fetching profile: ${error.message}`));
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        fetch('/profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => setMessage(data.message))
        .catch(error => setMessage(`Error updating profile: ${error.message}`));
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        fetch('/account/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newEmail }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => setMessage(data.message))
        .catch(error => setMessage(`Error requesting email change: ${error.message}`));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        fetch('/account/password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => setMessage(data.message))
        .catch(error => setMessage(`Error changing password: ${error.message}`));
    };

    const handleDeactivateAccount = () => {
        fetch('/account/deactivate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => setMessage(data.message))
        .catch(error => setMessage(`Error deactivating account: ${error.message}`));
    };

    const handleLogout = () => {
        fetch('/logout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                setMessage(data.message);
            }
        })
        .catch(error => setMessage(`Error logging out: ${error.message}`));
    };

    return (
        <div className="container">
            <div className='account__card card'>
                <h2>Account Settings</h2>
                {message && <p className="account__message">{message}</p>}
                <form onSubmit={handleProfileSubmit}>
                    <h3>Edit Profile</h3>
                    <div className='account__profile'>
                        <input
                            type="text"
                            name="firstName"
                            value={profile.firstName || ''}
                            onChange={handleProfileChange}
                            placeholder={profile.firstName || "First Name"}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={profile.lastName || ''}
                            onChange={handleProfileChange}
                            placeholder={profile.lastName || "Last Name"}
                            required
                        />
                        <input
                            type="text"
                            name="username"
                            value={profile.username || ''}
                            onChange={handleProfileChange}
                            placeholder={profile.username || "Username"}
                            required
                        />
                    </div>
                    <button className='account__btn btn-secondary' type="submit">Update Profile</button>
                </form>

                <form onSubmit={handleEmailSubmit}>
                    <h3>Change Email</h3>
                    <div className='account__email'>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="New Email"
                            required
                        />
                    </div>
                    <button className='account__btn btn-secondary' type="submit">Change Email</button>
                </form>

                <form onSubmit={handlePasswordSubmit}>
                    <h3>Change Password</h3>
                    <PasswordInput password={newPassword} setPassword={setNewPassword} confirmPass={confirmPassword} setConfirmPass={setConfirmPassword} />
                    <button className='account__btn btn-secondary' type="submit">Change Password</button>
                </form>

                <button className='account__de-btn btn-primary' onClick={handleDeactivateAccount}>Deactivate Account</button>
                <button className='account__btn btn-secondary' onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default AccountSettings;
