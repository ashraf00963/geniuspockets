import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function SpendingChart() {
  const [view, setView] = useState('days');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetchData(view);
  }, [view]);

  const fetchData = async (view) => {
    // Replace this URL with your actual data fetching URL
    const response = await fetch(`https://geniuspockets.com/get_spending_data.php?view=${view}`);
    const data = await response.json();
    const labels = view === 'days' ? data.days : data.months;
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
