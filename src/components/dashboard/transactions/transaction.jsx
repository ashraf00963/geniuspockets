import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTransactions(token);
  }, [navigate]);

  const fetchTransactions = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_all_transactions.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        setTransactions(response.transactions);
      },
      error: (xhr, status, error) => {
        console.error('Error fetching transactions:', error);
      }
    });
  };

  return (
    <div className="transactions">
      <h2>All Transactions</h2>
      <div className="transactions__list">
        {transactions.map((transaction, index) => (
          <div key={index} className="transaction__item">
            <p>Type: {transaction.type}</p>
            <p>Reason: {transaction.reason}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Date: {transaction.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transactions;
