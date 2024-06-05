import { useEffect } from 'react';
import { Charts, Jars, noFee, Logo } from '../../assets/index';
import { useNavigate } from 'react-router';
import './intro.css';

function Intro() {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkSession(token);
        }
    }, []);

    const checkSession = (token) => {
        $.ajax({
            url: 'https://geniuspockets.com/check_auth.php',
            method: 'POST',
            data: { token },
            dataType: 'json',
            success: (response) => {
                if (response.authenticated) {
                    navigate('/dashboard');
                }
            },
            error: (xhr, status, error) => {
                console.error('Session check failed:', error);
                localStorage.removeItem('token');
            }
        });
    };

    return (
        <div className='intro__page container'>
            <div className='intro__header'>
                <h1>Are you ready to fill your pockets?</h1>
                <p id='intro__header-p'>Genius Pockets makes it easy to save and control your finances</p>
            </div>
            <div className='intro__section'>
                <div className='intro__section-text'>
                    <h2>Maximize Your Savings Potential</h2>
                    <div className='intro__section1-text1'>
                        <h3>What are Pockets?</h3>
                        <p>Pockets are personalized saving compartments designed to help you manage and save your money effectively. Whether you are saving for a vacation, a new car, or an emergency fund, Genius Pockets provides a structured way to set aside money for your specific goals.</p>
                    </div>
                    <div className='intro__section1-text2'>
                        <h3>Why Use Pockets?</h3>
                        <p>Pockets allow you to allocate funds to different goals without the need for multiple bank accounts. This way, you can easily track your progress towards each goal and adjust your budget accordingly.</p>
                    </div>
                </div>
                <img src={Jars} alt="Jars" />
            </div>
            <div className='intro__section' id='light__section'>
                <img src={Charts} alt="Charts" />
                <div className='intro__section-text'>
                    <h2>With Less, You Can Make More</h2>
                    <div className='intro__section1-text3'>
                        <h3>• Easy Setup</h3>
                        <p>Register and create an account to get started. Once logged in, you can set up your profile and start creating pockets.</p>
                    </div>
                    <div className='intro__section1-text3'>
                        <h3>• Add Income and Expenses</h3>
                        <p>Input your salary and other sources of income. Add your monthly expenses and bills. This information helps us provide personalized saving recommendations.</p>
                    </div>
                    <div className='intro__section1-text3'>
                        <h3>• Create and Manage Pockets</h3>
                        <p>Create new pockets for each of your saving goals. Set target amounts and deadlines. Track your progress and adjust your savings plan as needed.</p>
                    </div>
                    <div className='intro__section1-text3'>
                        <h3>• Get Budget Recommendations</h3>
                        <p>Based on your income and expenses, Genius Pockets provides budget recommendations to help you save more effectively.</p>
                    </div>
                </div>
            </div>
            <div className='intro__section'>
                <div className='intro__section-text'>
                    <h2>Your Goals, Our Mission</h2>
                    <div className='intro__section3-text1'>
                        <h3>Free of Charge</h3>
                        <p>Enjoy all the features and benefits of our platform without spending a dime. From tracking your expenses to creating personalized savings pockets, everything is available to you for free.</p>
                    </div>
                    <div className='intro__section3-text2'>
                        <h3>No Hidden Fees</h3>
                        <p>At Genius Pockets, we are dedicated to maintaining a platform that puts your financial wellbeing first. We promise to keep our services free and transparent, helping you to save more and spend smarter.</p>
                    </div>
                </div>
                <img src={noFee} alt="No Fees" />
            </div>
            <footer className='intro__footer'>
                <div className='intro__footer-logo'>
                    <img src={Logo} alt="Genius Pockets Logo" />
                </div>
                <div className='intro__footer-container'>
                    <div className='intro__footer-info'>
                        <h4>Info</h4>
                        <ul>
                            <li>About Genius Pockets</li>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>
                    <div className='intro__footer-contact'>
                        <h4>Contact Us</h4>
                        <ul>
                            <li>Email: support@geniuspockets.com</li>
                            <li>Phone: +123-456-7890</li>
                            <li>Address: 123 Finance Street</li>
                        </ul>
                    </div>
                    <div className='intro__footer-social'>
                        <h4>Follow Us</h4>
                        <ul>
                            <li><a href="https://facebook.com">Facebook</a></li>
                            <li><a href="https://twitter.com">Twitter</a></li>
                            <li><a href="https://instagram.com">Instagram</a></li>
                        </ul>
                    </div>
                </div>
                <div className='intro__footer-bottom'>
                    <p>Genius Pockets</p>
                    <p>&copy; 2024 Genius Pockets. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Intro;
