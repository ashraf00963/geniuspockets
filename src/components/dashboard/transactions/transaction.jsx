import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './transaction.css';

function Transaction() {
  const [type, setType] = useState('add');
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const handleTransaction = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const data = {
      token,
      type,
      reason,
      amount,
    };

    const url = type === 'add' ? 'https://geniuspockets.com/add_money.php' : 'https://geniuspockets.com/withdraw_money.php';

    $.ajax({
      url,
      method: 'POST',
      data,
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          navigate('/dashboard');
        } else {
          console.error('Error processing transaction:', response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error processing transaction:', error);
      }
    });
  };

  return (
    <div className="transaction">
      <h2>Add Transaction</h2>
      <form onSubmit={handleTransaction}>
        <div className="transaction__field">
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="add">Add Money</option>
            <option value="withdraw">Withdraw</option>
          </select>
        </div>
        <div className="transaction__field">
          <label>Reason:</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <div className="transaction__field">
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Transaction;
