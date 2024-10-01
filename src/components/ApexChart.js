// ApexChart.js

import React from 'react';
import Chart from 'react-apexcharts';

const ApexChart = ({ chartData }) => {
  // Sample data for a pie chart
  const series = chartData.map(data => data.total_amount);
  const options = {
    chart: {
      type: 'pie',
    },
    labels: chartData.map(data => data.category_name),
  };

  return (
    <div className="apex-chart">
      <Chart options={options} series={series} type="pie" width="380" />
    </div>
  );
};

export default ApexChart;
