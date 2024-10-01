// BarChart.js

import React from 'react';
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  PointElement
);

const BarChartBackup = ({ chartData }) => {
  const data = {
    labels: chartData.map(elem => elem.category_name),
    datasets: [
      {
        label: '費用',
        data: chartData.map(elem => elem.total_amount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: '種類'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '金額'
        },
        ticks: {
          callback: function(value, index, values) {
            return '¥' + value.toLocaleString(); // Format y-axis ticks with ¥ symbol
          }
        }
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || ''; // Dataset label (e.g., '経費')
            if (context.dataset.data[context.dataIndex]) {
              // Format tooltip label with ¥ symbol and value
              label += ': ¥' + context.dataset.data[context.dataIndex].toLocaleString();
            }
            return label;
          }
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default BarChartBackup;
