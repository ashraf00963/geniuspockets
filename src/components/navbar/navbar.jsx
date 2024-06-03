import { useNavigate } from 'react-router';
import './navbar.css';
import { useEffect, useState } from 'react';

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleNaviToIntro = () => {
        navigate('/');
    }

    const handleNaviToLogin = () => {
        navigate('/login');
    }

    const handleNaviToRegister = () => {
        navigate('/register');
    }

    const handleNaviToAccountSettings = () => {
        navigate('/account');
    }

    return (
        <div className='navbar'>
            <div className='navbar__absolute'>
                <h1 onClick={handleNaviToIntro}><span id='genius'>Genius</span> Pockets</h1>
                <div className='navbar__buttons'>
                    {isLoggedIn ? (
                        <button className='login__button' onClick={handleNaviToAccountSettings}>Settings</button>
                    ) : (
                        <>
                            <button className='login__button' onClick={handleNaviToLogin}>Login</button>
                            <button className='register__button' onClick={handleNaviToRegister}>Register</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
