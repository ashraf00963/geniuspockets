import { useState } from 'react';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = { email, password };

    try {
      const response = await fetch('/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        // Save the token and redirect to the dashboard
        localStorage.setItem('token', result.token);
        setSuccess("Login successful! Redirecting to dashboard...");
        setError(null);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        setError(result.message);
        setSuccess(null);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      setSuccess(null);
    }
  };

  return (
        <div className='container'>
            <div className='Login__form'>
                <div className='Login__card card'>
                    <h2>Login</h2>
                    <div className='Login__messages'>
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className='Login__inputs'>
                            <input
                              type='email'
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder='Email'
                              required
                            />
                            <input
                              type='password'
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder='Password'
                              required
                            />
                        </div>
                        <button className='Login__btn btn-primary' type='submit'>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
