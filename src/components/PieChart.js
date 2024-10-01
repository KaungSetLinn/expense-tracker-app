import React from 'react';
import Chart from 'react-apexcharts';

const PieChart = ({ chartData }) => {
  // Extracting series and labels from chartData
  const series = chartData.map(data => data.total_amount);
  const labels = chartData.map(data => data.category_name);

  // Options for the pie chart
  const options = {
    chart: {
      type: 'pie',
    },
    labels: labels,
    plotOptions: {
      pie: {
        dataLabels: {
          formatter: function(val, opts) {
            return opts.w.globals.labels[opts.seriesIndex] + ": $" + val.toLocaleString(); // Custom label format
          },
        },
      },
    },
  };

  return (
    <div className="apex-chart">
      <Chart options={options} series={series} type="pie" width="420" />
    </div>
  );
};

export default PieChart;
