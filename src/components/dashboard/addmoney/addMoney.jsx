import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './addMoney.css';

function AddMoney() {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const handleAddMoney = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const data = {
      token,
      reason,
      amount,
    };

    $.ajax({
      url: 'https://geniuspockets.com/add_money.php',
      method: 'POST',
      data,
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          navigate('/dashboard');
        } else {
          console.error('Error adding money:', response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error adding money:', error);
      }
    });
  };

  return (
    <div className="add-money">
      <h2>Add Money</h2>
      <form onSubmit={handleAddMoney}>
        <div className="add-money__field">
          <label>Reason:</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <div className="add-money__field">
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

export default AddMoney;
