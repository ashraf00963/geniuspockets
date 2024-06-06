import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import $ from 'jquery';
import './spendingChart.css';

function SpendingChart() {
  const [spendingData, setSpendingData] = useState({ labels: [], amounts: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchSpendingData(token);
  }, [navigate]);

  const fetchSpendingData = (token) => {
    $.ajax({
      url: 'https://geniuspockets.com/get_spending_data.php',
      method: 'POST',
      data: { token },
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

  const data = {
    labels: spendingData.labels,
    datasets: [
      {
        label: 'Spending Over Time',
        data: spendingData.amounts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="spending-chart">
      <h2>All Time Spending</h2>
      <Bar data={data} />
    </div>
  );
}

export default SpendingChart;
