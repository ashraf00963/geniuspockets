import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './SpendingChart.css';

function SpendingChart() {
  const [view, setView] = useState('days');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetchData(view);
  }, [view]);

  const fetchData = async (view) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://geniuspockets.com/get_spending_data.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, view }),
      });
      const data = await response.json();
      const labels = data.labels;
      const amounts = data.amounts.map(amount => -Math.abs(amount));  // Ensure expenses are shown as negative

      setChartData({
        labels,
        datasets: [
          {
            label: `Spending in ${view === 'days' ? 'last 7 days' : 'last 12 months'}`,
            data: amounts,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching spending data:', error);
    }
  };

  return (
    <div className="spending-chart">
      <div className="chart-controls">
        <button onClick={() => setView('days')}>Days</button>
        <button onClick={() => setView('months')}>Months</button>
      </div>
      <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
    </div>
  );
}

export default SpendingChart;
