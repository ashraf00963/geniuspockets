import { Charts, Jars, noFee } from '../../assets/index'
import './intro.css';

function Intro () {
    return (
        <div className='intro__page'>
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
                <img src={Jars} />
            </div>
            <div className='intro__section' id='light__section'>
                <img src={Charts} />
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
                <img src={noFee} />
            </div>
            <div className='intro__footer'>
                <div className='intro__footer-section1'>
                    <h4>Info</h4>
                    <ul>
                        <li>About Genius Pockets</li>
                        <li>Privacy Policy</li>
                        <li>Terms of Service</li>
                    </ul>
                </div>
                <div className='intro__footer-section2'>
                    <h4>Contact Us</h4>
                    <ul>
                        <li>Email: support@geniuspockets.com</li>
                        <li>Phone: +123-456-7890</li>
                        <li>Address: 123 Finance street</li>
                    </ul>
                </div>
            </div>
            <p id='copyRight'>&copy; 2024 Genius Pockets. All rights reserved.</p>
        </div>
    )
}

export default Intro;