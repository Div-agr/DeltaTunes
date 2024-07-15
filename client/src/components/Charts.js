import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import '../styles/Charts.css'; // Import the CSS file
import { NavBar } from './NavBar';

Chart.register(...registerables);

const Charts = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activityData, setActivityData] = useState(null);
  const currentUserId = localStorage.getItem('userId');

  const fetchUserActivity = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/charts', {
        params: { userId: currentUserId, startDate, endDate }
      });
      setActivityData(response.data);
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
  }, [currentUserId, startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchUserActivity();
    }
  }, [fetchUserActivity, startDate, endDate]);

  const generateColors = (length) => {
    const colors = [
      'rgba(100, 255, 10, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(199, 199, 199, 0.6)',
      'rgba(83, 102, 255, 0.6)',
      'rgba(159, 255, 64, 0.6)',
      'rgba(64, 159, 255, 0.6)'
    ];

    if (length <= colors.length) {
      return colors.slice(0, length);
    }

    const generatedColors = [];
    for (let i = 0; i < length; i++) {
      generatedColors.push(colors[i % colors.length]);
    }
    return generatedColors;
  };

  const generateChartData = (data, label) => ({
    labels: data.map(item => item[label]),
    datasets: [
      {
        label: `${label} Distribution`,
        data: data.map(item => item.percentage),
        backgroundColor: generateColors(data.length),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  return (
    <div className="charts-container">
      <NavBar />
      <h2>User Activity Charts</h2>
      <div className="form-container">
        <label>
          <div className="chooseDate">Start Date:</div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          <div className="chooseDate">End Date:</div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={fetchUserActivity}>Fetch Activity</button>
      </div>
      {activityData && (
        <div className="charts-display">
          <div className="chart">
            <h3>Genre Distribution</h3>
            <Pie key="genreChart" data={generateChartData(activityData.genreDistribution, 'genre')} />
          </div>
          <div className="chart">
            <h3>Artist Distribution</h3>
            <Bar key="artistChart" data={generateChartData(activityData.artistDistribution, 'artist')} />
          </div>
          <div className="chart">
            <h3>Language Distribution</h3>
            <Pie key="languageChart" data={generateChartData(activityData.languageDistribution, 'language')} />
          </div>
        </div>
      )}
    </div>
  );
};

export { Charts };
