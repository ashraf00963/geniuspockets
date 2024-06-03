import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

function AuthCheck({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // Make a request to your backend to verify the session
                    const response = await axios.post('/checkSession.php', { token });
                    if (!response.data.success) {
                        // If session is invalid, call logout endpoint
                        await axios.post('/logout.php');
                        // Clear local storage
                        localStorage.removeItem('token');
                        // Redirect to login page
                        navigate('/login');
                    }
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error checking session:', error);
                // Handle any errors, such as network issues
            }
        };

        checkSession();
    }, [navigate]);

    return children;
}

export default AuthCheck;
