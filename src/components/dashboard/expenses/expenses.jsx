import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './expenses.css';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ reason: '', amount: '' });
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
      url: 'https://geniuspockets.com/get_recent_expenses.php',
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

    $.ajax({
      url: 'https://geniuspockets.com/add_expense.php',
      method: 'POST',
      data: { ...newExpense, token },
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          setNewExpense({ reason: '', amount: '' });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="expenses">
      <h2>My Expenses</h2>
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
        <select
          name="reason"
          value={newExpense.reason}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="food&goods">Food & Goods</option>
          <option value="entertainment">Entertainment</option>
          <option value="house_extras">House Extras</option>
          <option value="rent">Rent</option>
          <option value="bills">Bills</option>
        </select>
        <input
          type="number"
          name="amount"
          value={newExpense.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
        />
        <button type="submit" className="add-expense-button">
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default Expenses;
