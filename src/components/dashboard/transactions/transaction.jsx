import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import './transaction.css';

function Transaction() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTransactions(token);
  }, []);

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
          <div key={index} className={`transaction ${transaction.type}`}>
            <p>{transaction.type === 'add' ? 'Income' : 'Expense'}: {transaction.reason}</p>
            <p>{transaction.amount}</p>
            <p>{transaction.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transaction;
