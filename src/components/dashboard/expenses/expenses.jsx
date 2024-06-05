import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './expenses.css';

function Expenses() {
  const [reason, setReason] = useState('food & goods');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchExpenses(token);
  }, [navigate]);

  const fetchExpenses = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_all_expenses.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        setExpenses(response.expenses);
      },
      error: (xhr, status, error) => {
        console.error('Error fetching expenses:', error);
      }
    });
  };

  const handleExpense = (e) => {
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
          fetchExpenses(token);
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
      <h2>Expenses</h2>
      <form onSubmit={handleExpense}>
        <div className="expenses__field">
          <label>Category:</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="food & goods">Food & Goods</option>
            <option value="entertainment">Entertainment</option>
            <option value="house extras">House Extras</option>
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
      <div className="expenses__list">
        <h3>All Expenses</h3>
        {expenses.map((expense, index) => (
          <div key={index} className="expense">
            <p>Category: {expense.reason}</p>
            <p>Amount: ${expense.amount}</p>
            <p>Date: {expense.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Expenses;
