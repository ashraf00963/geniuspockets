import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './expenses.css';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
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
          setReason('');
          setAmount('');
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
      <h2>All Expenses</h2>
      <div className="expenses__list">
        {expenses.map((expense, index) => (
          <div key={index} className="expense">
            <p>Reason: {expense.reason}</p>
            <p>Amount: ${expense.amount}</p>
            <p>Date: {expense.date}</p>
          </div>
        ))}
      </div>
      <form className="add-expense-form" onSubmit={handleAddExpense}>
        <h3>Add New Expense</h3>
        <div className="expense__field">
          <label>Reason:</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)} required>
            <option value="">Select Reason</option>
            <option value="food&goods">Food & Goods</option>
            <option value="entertainment">Entertainment</option>
            <option value="house">House</option>
            <option value="extras">Extras</option>
            <option value="rent">Rent</option>
            <option value="bills">Bills</option>
          </select>
        </div>
        <div className="expense__field">
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="add-expense-button">Add Expense</button>
      </form>
    </div>
  );
}

export default Expenses;
