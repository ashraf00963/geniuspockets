import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
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
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('/checkSession.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (!data.success) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    // Fetch user profile data
                    fetchProfile();
                }
            } catch (error) {
                setMessage(`Error checking session: ${error.message}`);
                navigate('/login');
            }
        };
        
        const fetchProfile = async () => {
            try {
                const response = await fetch('/profile.php');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProfile(data.data);
            } catch (error) {
                setMessage(`Error fetching profile: ${error.message}`);
            }
        };

        checkSession();
    }, [navigate]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/profile.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profile),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage(`Error updating profile: ${error.message}`);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/request_email_change.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newEmail }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage(`Error requesting email change: ${error.message}`);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage(`Error changing password: ${error.message}`);
        }
    };

    const handleDeactivateAccount = async () => {
        try {
            const response = await fetch('/deactivate.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMessage(data.message);
            if (data.success) {
                setTimeout(() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }, 1000);
            }
        } catch (error) {
            setMessage(`Error deactivating account: ${error.message}`);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/logout.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.success) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } catch (error) {
            setMessage(`Error logging out: ${error.message}`);
        }
    };

    useEffect(() => {
        localStorage.setItem('username', profile.username);
    }, [profile.username]);
    
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
                            value={profile.firstName}
                            onChange={handleProfileChange}
                            placeholder={profile.firstName || "First Name"}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleProfileChange}
                            placeholder={profile.lastName || "Last Name"}
                            required
                        />
                        <input
                            type="text"
                            name="username"
                            value={profile.username}
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

                <div className='account__end-btns'>
                    <button className='account__logout-btn btn-secondary' onClick={handleLogout}>Logout</button>
                    <div className='account__danger-zone'>
                        <h3>Danger Zone</h3>
                        <button className='account__de-btn btn-primary' onClick={handleDeactivateAccount}>Deactivate Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountSettings;
