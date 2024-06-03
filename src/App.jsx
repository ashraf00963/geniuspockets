import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './components/user/register/register';
import Login from './components/user/login/login';
import AccountSettings from './components/user/accountSettings/account';
import Navbar from './components/navbar/navbar';
import Intro from './components/intro/intro';
import AuthCheck from './components/user/AuthCheck';

function App() {
  return (
    <Router>
      <AuthCheck />
      <Navbar />
      <Routes>
        <Route path='/' element={<Intro />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/account' element={<AccountSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
