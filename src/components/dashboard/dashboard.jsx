import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './dashboard.css';

function Dashboard() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [savingsPockets, setSavingsPockets] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
          fetchTotalIncome(token);
          fetchTotalExpenses(token);
          fetchSavingsPockets(token);
          fetchRecentTransactions(token, 'expense');
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

  const fetchTotalIncome = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_total_income.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        setTotalIncome(response.total_income);
      },
      error: (xhr, status, error) => {
        console.error('Error fetching total income:', error);
      }
    });
  };

  const fetchTotalExpenses = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_total_expenses.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        setTotalExpenses(response.total_expenses);
      },
      error: (xhr, status, error) => {
        console.error('Error fetching total expenses:', error);
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
        setSavingsPockets(response.savings_pockets);
      },
      error: (xhr, status, error) => {
        console.error('Error fetching savings pockets:', error);
      }
    });
  };

  const fetchRecentTransactions = (token, type) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_recent_transactions.php',
      method: 'POST',
      data: { token, type },
      dataType: 'json',
      success: (response) => {
        setRecentTransactions(response.transactions);
      },
      error: (xhr, status, error) => {
        console.error('Error fetching recent transactions:', error);
      }
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard__overview">
        <h2>Dashboard Overview</h2>
        <div className="dashboard__overview-cards">
          <div className="dashboard__card">
            <h3>Total Balance</h3>
            <p>${totalBalance}</p>
          </div>
          <div className="dashboard__card">
            <h3>Total Income</h3>
            <p>${totalIncome}</p>
          </div>
          <div className="dashboard__card">
            <h3>Total Expenses</h3>
            <p>${totalExpenses}</p>
          </div>
        </div>
      </div>
      <div className="dashboard__savings-pockets">
        <h2>Savings Pockets</h2>
        <div className="dashboard__pockets-list">
          {savingsPockets.map((pocket) => (
            <div key={pocket.id} className="dashboard__pocket">
              <h3>{pocket.name}</h3>
              <p>Target: ${pocket.target_amount}</p>
              <p>Current: ${pocket.current_amount}</p>
              <p>Progress: {pocket.progress_percentage.toFixed(2)}%</p>
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard__recent-transactions">
        <h2>Recent Transactions</h2>
        <div className="dashboard__transactions-list">
          {recentTransactions.map((transaction, index) => (
            <div key={index} className="dashboard__transaction">
              <p>{transaction.description}</p>
              <p>{transaction.amount}</p>
              <p>{transaction.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
