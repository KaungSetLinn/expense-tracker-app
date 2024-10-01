// PieChart.js

import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  Legend as ChartLegend
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  ChartLegend
);

const PieChartBackup = ({ chartData }) => {
  const data = {
    labels: chartData.map(elem => elem.category_name),
    datasets: [
      {
        label: '費用',
        data: chartData.map(elem => elem.total_amount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
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
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || ''; // Segment label (e.g., category name)
            if (context.raw) {
              // Format tooltip label with ¥ symbol and value
              label += ': ¥' + context.raw.toLocaleString();
            }
            return label;
          }
        }
      },
    }
  };

  return <Pie data={data} options={options} />;
};

export default PieChartBackup;
