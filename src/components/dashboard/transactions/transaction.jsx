import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './transaction.css';

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
      <table className="transactions__table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Reason</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className={transaction.amount < 0 ? 'expense' : 'income'}>
              <td>{transaction.type}</td>
              <td>{transaction.reason}</td>
              <td>€{transaction.amount}</td>
              <td>{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;
