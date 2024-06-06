import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import $ from 'jquery';
import 'chart.js/auto';
import './SpendingChart.css';

function SpendingChart() {
  const [view, setView] = useState('days');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetchData(view);
  }, [view]);

  const fetchData = (view) => {
    const token = localStorage.getItem('token');
    $.ajax({
      url: `https://geniuspockets.com/get_spending_data.php?view=${view}`,
      method: 'POST',
      data: { token },
      dataType: 'json',
      success: (data) => {
        const labels = data.labels;
        const amounts = data.amounts;

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
      },
      error: (xhr, status, error) => {
        console.error('Error fetching spending data:', error);
      }
    });
  };

  return (
    <div className="spending-chart">
      <div className="chart-controls">
        <button onClick={() => setView('days')}>Days</button>
        <button onClick={() => setView('months')}>Months</button>
      </div>
      <Bar data={chartData} />
    </div>
  );
}

export default SpendingChart;
