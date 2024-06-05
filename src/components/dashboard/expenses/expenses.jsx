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
    <div className="expenses container">
      <h2>All Expenses</h2>
      <button onClick={() => setShowAddExpenseForm(true)}>Add Expense</button>
      {showAddExpenseForm && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Add New Expense</h3>
            <form className="add-expense-form" onSubmit={handleAddExpense}>
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
              <button onClick={() => setShowAddExpenseForm(false)}>Close</button>
            </form>
          </div>
        </div>
      )}
      <div className="expenses__list">
        <h3>All Expenses</h3>
        <table>
          <thead>
            <tr>
              <th>Reason</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.reason}</td>
                <td>${expense.amount}</td>
                <td>{expense.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Expenses;
