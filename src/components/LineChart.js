import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';

const LineChart = ({ chartData, viewType }) => {
  // Check if chartData contains any objects with the 'month' property
  const hasMonthProperty = chartData.some(data => data.hasOwnProperty('month'));

  // Extracting series and labels from chartData
  const series = [{
    name: "金額",
    data: chartData.map(data => data.amount)
  }];

  // Conditional labels based on the presence of 'month'
  const labels = {
    categories: hasMonthProperty
      ? chartData.map(data => data.month + "月") // Use 'month' if it exists
      : chartData.map(data => data.day + "日")   // Otherwise use 'day'
  };


  // Options for the line chart
  const options = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false // Hide toolbar
      },
      zoom: {
        enabled: false // Disable zoom
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight', // Smooth line
      width: 2
    },
    markers: {
      size: 4, // Size of the markers
      strokeWidth: 2,
      hover: {
        size: 7 // Size of the marker on hover
      }
    },
    xaxis: {
      categories: labels.categories,
      title: {
        text: hasMonthProperty ? '月' : '日付', // Change title based on categories
        style: {
          fontWeight: 600,
        }
      }
    },
    yaxis: {
      title: {
        text: '金額（￥）',
        style: {
          fontWeight: 600,
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "￥" + val.toLocaleString();
        }
      }
    }
  };

  return (
    <div className="apex-chart">
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
};

export default LineChart;
