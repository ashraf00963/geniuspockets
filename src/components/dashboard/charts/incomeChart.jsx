import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import $ from 'jquery';
import './incomeChart.css'; // Import the CSS file

function IncomeChart() {
  const [incomeData, setIncomeData] = useState({ labels: [], amounts: [] });
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchIncomeData(token);
  }, [navigate]);

  const fetchIncomeData = (token, date = null) => {
    const data = { token };
    if (date) {
      data.start_date = date;
    }

    $.ajax({
      url: 'https://geniuspockets.com/get_income_data.php',
      method: 'POST',
      data,
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          setIncomeData({ labels: response.labels, amounts: response.amounts });
        } else {
          console.error('Error fetching income data:', response.message);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error fetching income data:', error);
      }
    });
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const token = localStorage.getItem('token');
    fetchIncomeData(token, date);
  };

  const data = {
    labels: incomeData.labels.slice(-5), // Show only the last 5 transactions initially
    datasets: [
      {
        label: 'Income Over Time',
        data: incomeData.amounts.slice(-5), // Show only the last 5 transactions initially
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
    <div className="income-chart">
      <h2>All Time Income</h2>
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

export default IncomeChart;
