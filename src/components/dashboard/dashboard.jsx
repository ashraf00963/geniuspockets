import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './dashboard.css';

function Dashboard() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [savingsPockets, setSavingsPockets] = useState([]);
  const [recentAdditions, setRecentAdditions] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
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
          fetchRecentAdditions(token);
          fetchRecentExpenses(token);
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

  const fetchRecentAdditions = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_recent_transactions.php',
      method: 'POST',
      data: { token, type: 'add' },
      dataType: 'json',
      success: (response) => {
        setRecentAdditions(response.transactions.slice(0, 2)); // Get only the latest two additions
      },
      error: (xhr, status, error) => {
        console.error('Error fetching recent additions:', error);
      }
    });
  };

  const fetchRecentExpenses = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_recent_transactions.php',
      method: 'POST',
      data: { token, type: 'expense' },
      dataType: 'json',
      success: (response) => {
        setRecentExpenses(response.transactions.slice(0, 2)); // Get only the latest two expenses
      },
      error: (xhr, status, error) => {
        console.error('Error fetching recent expenses:', error);
      }
    });
  };

  const handleShowMorePockets = () => {
    navigate('/dashboard/mypockets');
  };

  const handleAddIncome = () => {
    navigate('/dashboard/income');
  };

  const handleAddExpense = () => {
    navigate('/dashboard/expenses');
  };

  const handleViewTransactions = () => {
    navigate('/dashboard/transactions');
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
        <button className="show-more-button" onClick={handleShowMorePockets}>
          Show More
        </button>
      </div>
      <div className="dashboard__recent-transactions">
        <h2>Recent Transactions</h2>
        <div className="dashboard__transactions-list">
          {recentAdditions.map((transaction, index) => (
            <div key={index} className="dashboard__transaction">
              <p>{transaction.reason}</p>
              <p>{transaction.amount}</p>
              <p>{transaction.date}</p>
            </div>
          ))}
        </div>
        <button className="add-income-button" onClick={handleAddIncome}>
          Add Income
        </button>
        <button className="add-expense-button" onClick={handleAddExpense}>
          Add Expense
        </button>
        <button className="view-transactions-button" onClick={handleViewTransactions}>
          View All Transactions
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
