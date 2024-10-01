import React from 'react';
import Chart from 'react-apexcharts';

const BarChart = ({ chartData }) => {
  // Extracting series and labels from chartData
  const series = [{
    name: "金額",
    data: chartData.map(data => data.total_amount)
  }];

  const labels = {
    categories: chartData.map(data => data.category_name)
  };

  // Options for the bar chart
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false // Hide toolbar
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: labels.categories,
      title: {
        text: 'カテゴリ',
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
    fill: {
      opacity: 1
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
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default BarChart;
