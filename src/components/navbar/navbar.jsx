import { useNavigate } from 'react-router';
import './navbar.css';

function Navbar() {
    const navigate = useNavigate();

    const handleNaviToIntro = () => {
        navigate('/');
    }

    const handleNaviToLogin = () => {
        navigate('/login');
    }

    const handleNaviToRegister = () => {
        navigate('/register');
    }

    return (
        <div className='navbar'>
            <div className='navbar__absolute'>
                <h1 onClick={handleNaviToIntro}><span id='genius'>Genius</span> Pockets</h1>
                <div className='navbar__buttons'>
                    <button className='login__button' onClick={handleNaviToLogin}>Login</button>
                    <button className='register__button' onClick={handleNaviToRegister}>Register</button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
