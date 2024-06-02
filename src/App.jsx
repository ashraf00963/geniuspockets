import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './components/user/register/register';
import Login from './components/user/login/login';
import AccountSettings from './components/user/accountSettings/account';
import ProtectedRoute from './components/user/ProtectedRoute';
import Navbar from './components/navbar/navbar';
import Intro from './components/intro/intro';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Intro />} />
        <Route path='/register' element={
          <ProtectedRoute>
            <Register />
          </ProtectedRoute>
        } />
        <Route path='/login' element={
          <ProtectedRoute>
            <Login />
          </ProtectedRoute>
        } />
        <Route path='/account' element={<AccountSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
