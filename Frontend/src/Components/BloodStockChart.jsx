import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BloodStockChart = ({ hospitals }) => {
console.log(hospitals,"hospitals")
  // Function to process the blood stock data and calculate total units for each hospital
  const getTotalUnits = () => {
    return hospitals.map((hospital) => {
      const bloodStock = hospital?.AvailableBlood || [];
      // Sum the units of all blood groups for each hospital
      const totalUnits = bloodStock.reduce((total, blood) => total + blood.units, 0);
      return totalUnits;
    });
  };

  // Chart.js data structure
  const data = {
    labels: hospitals.map((hospital) => hospital?.name), // Hospital names as labels
    datasets: [
      {
        label: 'Total Blood Stock (Units)',
        data: getTotalUnits(), // Total units for each hospital
        backgroundColor: hospitals.map((_, index) => `rgba(${255 - (index * 40)}, 99, 132, 0.2)`), // Dynamic color for each hospital
        borderColor: hospitals.map((_, index) => `rgba(${255 - (index * 40)}, 99, 132, 1)`),
        borderWidth: 1,
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Total Blood Stock Across Hospitals', // General title for all hospitals
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} Units`, // Show total units in the tooltip
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Total Blood Stock Across Hospitals</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BloodStockChart;
