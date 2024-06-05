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
      <div className="transactions__list">
        {transactions.map((transaction, index) => (
          <div key={index} className="transaction__item">
            <div className='trans__type'>
              <p>Type</p>
              <p>{transaction.type}</p>
            </div>
            <div className='trans__reason'>
              <p>Reason</p>
              <p>{transaction.reason}</p>
            </div>
            <div className='trans__amount'>
              <p>Amount</p>
              <p>{transaction.amount}</p>
            </div>
            <div className='trans__date'>
              <p>Date</p>
              <p>{transaction.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transactions;
