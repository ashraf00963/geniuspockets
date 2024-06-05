import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './expenses.css';

function Expenses() {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const handleAddExpense = (e) => {
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
      url: 'https://geniuspockets.com/add_expense.php',
      method: 'POST',
      data,
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          navigate('/dashboard');
        } else {
          console.error('Error adding expense:', response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error adding expense:', error);
      }
    });
  };

  return (
    <div className="expenses">
      <h2>Add Expense</h2>
      <form onSubmit={handleAddExpense}>
        <div className="expenses__field">
          <label>Reason:</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">Select Reason</option>
            <option value="food">Food & Goods</option>
            <option value="entertainment">Entertainment</option>
            <option value="house">House</option>
            <option value="extras">Extras</option>
            <option value="rent">Rent</option>
            <option value="bills">Bills</option>
          </select>
        </div>
        <div className="expenses__field">
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

export default Expenses;
