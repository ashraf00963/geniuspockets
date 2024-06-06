import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import $ from 'jquery';
import './spendingChart.css';

function SpendingChart() {
  const [spendingData, setSpendingData] = useState({ labels: [], amounts: [] });
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchSpendingData(token);
  }, [navigate]);

  const fetchSpendingData = (token, date = null) => {
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
          setSpendingData({ labels: response.labels, amounts: response.amounts });
        } else {
          console.error('Error fetching spending data:', response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error fetching spending data:', error);
      }
    });
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const token = localStorage.getItem('token');
    fetchSpendingData(token, date);
  };

  const data = {
    labels: spendingData.labels.slice(-5), // Show only the last 5 transactions initially
    datasets: [
      {
        label: 'Spending Over Time',
        data: spendingData.amounts.slice(-5), // Show only the last 5 transactions initially
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
    <div className="spending-chart">
      <h2>All Time Spending</h2>
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

export default SpendingChart;
