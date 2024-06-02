import { useState } from 'react';
import { useNavigate } from 'react-router';
import './navbar.css';

function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleNaviToLogin = () => {
        navigate('/login');
    }

    const handleNaviToRegister = () => {
        navigate('/register');
    }

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    return (
        <div className='navbar'>
            <div className='navbar__absolute'>
                <h1><span id='genius'>Genius</span> Pockets</h1>
                <div className='navbar__buttons'>
                    <div className={`hamburger ${dropdownOpen ? 'open' : ''}`} onClick={toggleDropdown}>
                        <div className="bar1"></div>
                        <div className="bar2"></div>
                        <div className="bar3"></div>
                    </div>
                    <div className={`dropdown__content ${dropdownOpen ? 'show' : ''}`}>
                        <button className='login__button' onClick={handleNaviToLogin}>Login</button>
                        <button className='register__button' onClick={handleNaviToRegister}>Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
