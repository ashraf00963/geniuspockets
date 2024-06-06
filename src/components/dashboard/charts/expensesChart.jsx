import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import $ from 'jquery';
import './expensesChart.css'; // Import the CSS file

function ExpensesChart() {
  const [expensesData, setExpensesData] = useState({ labels: [], amounts: [] });
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchExpensesData(token);
  }, [navigate]);

  const fetchExpensesData = (token, date = null) => {
    const data = { token };
    if (date) {
      data.start_date = date;
    }

    $.ajax({
      url: 'https://geniuspockets.com/get_spending_data.php',
      method: 'POST',
      data,
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          setExpensesData({ labels: response.labels, amounts: response.amounts });
        } else {
          console.error('Error fetching expenses data:', response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error fetching expenses data:', error);
      }
    });
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const token = localStorage.getItem('token');
    fetchExpensesData(token, date);
  };

  const data = {
    labels: expensesData.labels.slice(-5), // Show only the last 5 transactions initially
    datasets: [
      {
        label: 'Expenses Over Time',
        data: expensesData.amounts.slice(-5), // Show only the last 5 transactions initially
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="expenses-chart">
      <h2>All Time Expenses</h2>
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="date-picker"
      />
      <Bar data={data} options={options} />
    </div>
  );
}

export default ExpensesChart;
