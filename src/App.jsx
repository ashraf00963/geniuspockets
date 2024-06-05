import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './components/user/register/register';
import Login from './components/user/login/login';
import AccountSettings from './components/user/accountSettings/account';
import Navbar from './components/navbar/navbar';
import Intro from './components/intro/intro';
import AuthCheck from './components/user/AuthCheck';
import Identify from './components/user/forgotPassword/identify';
import Dashboard from './components/dashboard/dashboard';
import Pockets from './components/dashboard/pockets/pockets';
import Transaction from './components/dashboard/transactions/transaction';
import Expenses from './components/dashboard/expenses/expenses';
import AddMoney from './components/dashboard/income/income';
import Income from './components/dashboard/income/income';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Intro />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/login/identify' element={<Identify />} />
        <Route path='/account' element={<AuthCheck><AccountSettings /></AuthCheck>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/dashboard/mypockets' element={<Pockets />} />
        <Route path='/dashboard/transaction' element={<Transaction />} /> 
        <Route path='/dashboard/expenses' element={<Expenses />} />
        <Route path='/dashboard/add-money' element={<Income />} />
      </Routes>
    </Router>
  );
}

export default App;
