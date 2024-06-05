import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import './income.css';

function Income() {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [incomes, setIncomes] = useState([]);
  const [showAddIncomeForm, setShowAddIncomeForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchIncomes(token);
  }, [navigate]);

  const fetchIncomes = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_all_incomes.php',
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (response) => {
        setIncomes(response.incomes);
      },
      error: (xhr, status, error) => {
        console.error('Error fetching incomes:', error);
      }
    });
  };

  const handleAddIncome = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const data = { token, reason, amount };

    $.ajax({
      url: 'https://geniuspockets.com/add_income.php',
      method: 'POST',
      data,
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          setShowAddIncomeForm(false);
          setReason('');
          setAmount('');
          fetchIncomes(token);
        } else {
          console.error('Error adding income:', response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error adding income:', error);
      }
    });
  };

  return (
    <div className="income container">
      <h2>Income</h2>
      <button onClick={() => setShowAddIncomeForm(true)}>Add Income</button>
      {showAddIncomeForm && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Add Income</h3>
            <form onSubmit={handleAddIncome}>
              <div className="income__field">
                <label>Reason:</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
              <div className="income__field">
                <label>Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Add Income</button>
              <button onClick={() => setShowAddIncomeForm(false)}>Close</button>
            </form>
          </div>
        </div>
      )}
      <div className="income__list">
        <h3>All Incomes</h3>
        <table>
          <thead>
            <tr>
              <th>Reason</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income, index) => (
              <tr key={index}>
                <td>{income.reason}</td>
                <td>{income.amount}</td>
                <td>{income.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Income;
