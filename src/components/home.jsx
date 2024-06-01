import { useNavigate } from "react-router";

function Home() {
    const navigate = useNavigate();

    const handleNaviReg = () => {
        navigate('/login');
    }

    const handleNaviLogin = () => {
        navigate('/register');
    }

    const handleNaviSettings = () => {
        navigate('/settings');
    }
    
    return (
        <div className="container">
            <button className="btn-primary" onClick={handleNaviReg}>Login</button>
            <button className="btn-primary" onClick={handleNaviLogin}>Register</button>
            <button className="btn-primary" onClick={handleNaviSettings}>Settings</button>
        </div>
    )
}

export default Home;