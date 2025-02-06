// src/Components/PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const PieChart = ({ data }) => {
  console.log(data);
  const chartData = {
    labels: ['Group A+','Group A-', 'Group B+','Group B-', 'Group o+', 'Group o-','Group AB+','Group AB-'], // Replace with dynamic blood groups
    datasets: [
      {
        label: 'Blood Stock Breakdown',
        data: data, // This should be the blood stock data array
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733','#efed44',"green",'orange','blue'], // Color for each section
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="w-[400px] h-[400px]">
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
