import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './dashboard.css';

function Dashboard() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [savingsPockets, setSavingsPockets] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    setUserName(username);
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    $.ajax({
      url: 'https://geniuspockets.com/check_auth.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        if (!response.authenticated) {
          navigate('/login');
        } else {
          fetchTotalBalance(token);
          fetchSavingsPockets(token);
          fetchRecentTransactions(token);
        }
      },
      error: (xhr, status, error) => {
        console.error('Authentication check failed:', error);
        navigate('/login');
      }
    });
  };

  const fetchTotalBalance = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_total_balance.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        setTotalBalance(response.total_balance);
      },
      error: (xhr, status, error) => {
        console.error('Error fetching total balance:', error);
      }
    });
  };

  const fetchSavingsPockets = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_savings_pockets.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        setSavingsPockets(response.savings_pockets.slice(0, 2)); // Get only the last two pockets
      },
      error: (xhr, status, error) => {
        console.error('Error fetching savings pockets:', error);
      }
    });
  };

  const fetchRecentTransactions = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_recent_transactions.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        setRecentTransactions(response.transactions.slice(0, 3)); // Get only the last three transactions
      },
      error: (xhr, status, error) => {
        console.error('Error fetching recent transactions:', error);
      }
    });
  };

  const handleShowMorePockets = () => {
    navigate('/dashboard/mypockets');
  };

  const handleAddTransaction = () => {
    navigate('/dashboard/transaction');
  };

  return (
    <div className="dashboard">
      <h1>Welcome back {userName},</h1>
      <div className="dashboard__overview">
        <h2>My Dashboard</h2>
        <div className="dashboard__overview-cards">
          <div className="dashboard__card">
            <h3>Total Balance</h3>
            <p>${totalBalance}</p>
          </div>
        </div>
      </div>
      <div className="dashboard__savings-pockets">
        <h2>Savings Pockets</h2>
        <div className="dashboard__pockets-list">
          {savingsPockets.map((pocket) => (
            <div key={pocket.id} className="dashboard__pocket">
              <h3>{pocket.name}</h3>
              <p>Goal: ${pocket.goal_amount}</p>
              <p>Deadline: {pocket.deadline}</p>
              <p>Saved: ${pocket.saved_amount}</p>
            </div>
          ))}
        </div>
        {savingsPockets.length > 0 && (
          <button className="show-more-button" onClick={handleShowMorePockets}>
            Show More
          </button>
        )}
      </div>
      <div className="dashboard__transactions">
        <h2>Recent Transactions</h2>
        <div className="dashboard__transactions-list">
          {recentTransactions.map((transaction, index) => (
            <div key={index} className="dashboard__transaction">
              <p>{transaction.type}: ${transaction.amount}</p>
              <p>{transaction.date}</p>
            </div>
          ))}
        </div>
        <button className="add-transaction-button" onClick={handleAddTransaction}>
          Add Money
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
