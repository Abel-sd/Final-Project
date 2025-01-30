import React, { useState, useEffect } from 'react';
import UseFetchAllScheduledBlood from '../hooks/UseFechScheduledBlood';
import UseFetchAllInventoryReport from '../hooks/UseFechInventoryReport';
import UseFetchAllHospital from '../hooks/UseFechAllHospital';
import UseFetchAllDonor from '../hooks/UseFechAllDonor';
import BloodStockChart from '../Components/BloodStockChart';
import PieChart from '../Components/BloodStockPieChart'; // Import the PieChart component
import useAlertlowBlood from '../hooks/UseAlertLowBlood';

export default function AdminDashboard() {
  const { data: schedule } = UseFetchAllScheduledBlood();
  const { data: bloodInventory } = UseFetchAllInventoryReport();
  const recentDonors = schedule?.data?.filter((item) => item.Iscollected === true);

  const { data: hospital } = UseFetchAllHospital();
  const { data: Donors } = UseFetchAllDonor();

  const totalexpecteddonation = schedule?.data.filter((item) => item.Iscollected === false).length;

  // Prepare pie chart data (for example, based on blood stock)
  const bloodStockData = bloodInventory?.data?.inventory.map((stock) => stock.units) || [];
  const {mutate,isPending}=useAlertlowBlood({
    onSuccess: () => {
      console.log('Alert sent successfully!');
    },
    onError: (error) => {
      console.log('Failed to send alert!', error);
    },
  })
  // Define a threshold for low blood stock
  const lowStockThreshold = 3000; // Change this threshold as per your requirements
  const [lowStockAlert, setLowStockAlert] = useState(false);
  const [lowStockBloodGroups, setLowStockBloodGroups] = useState([]);

  // Check if any blood stock is below the threshold
  useEffect(() => {
    const lowStockGroups = bloodInventory?.data?.inventory.filter(
      (stock) => stock.units < lowStockThreshold
    ).map((stock) => stock.bloodGroup); // Get the blood groups with low stock
    setLowStockBloodGroups(lowStockGroups);
    setLowStockAlert(lowStockGroups?.length > 0); // Show alert if any blood group is low
  }, [bloodInventory]);

  // Handle the alert button click
  const handleAlertClick = () => {
mutate()
  };

  return (
    <div className="w-[90%] mx-auto flex flex-col gap-8">
      {/* Overview Cards Section */}
      <div className="flex flex-wrap justify-between gap-6">
        <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 flex-1 min-w-[200px]">
          <p className="text-red-600 text-4xl font-bold">{recentDonors?.length}</p>
          <p className="text-gray-600 text-lg">Total Donations</p>
        </div>

        <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 flex-1 min-w-[200px]">
          <p className="text-green-600 text-4xl font-bold">{bloodInventory?.data?.totalUnits}</p>
          <p className="text-gray-600 text-lg">Total Blood Stock</p>
        </div>

        <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 flex-1 min-w-[200px]">
          <p className="text-blue-600 text-4xl font-bold">
            {Donors?.data?.length} / {hospital?.data?.length}
          </p>
          <p className="text-gray-600 text-lg">Registered Donors / Hospitals</p>
        </div>
        
      </div>
      
      {/* Alert for low blood stock */}
      {lowStockAlert && (
        <div className="bg-yellow-300 p-4 rounded-lg shadow-md flex justify-between items-center">
          <p className="text-black text-lg font-bold">
            Low Blood Stock Alert! The following blood groups are below the minimum threshold: {lowStockBloodGroups.join(', ')}.
          </p>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
            onClick={handleAlertClick}
          >
            Alert Now
          </button>
        </div>
      )}

      <div className="flex flex-wrap justify-between gap-6">
        {/* Blood Stock Chart */}
        <div className=" flex items-center justify-center">
          <BloodStockChart hospitals={hospital?.data || []} />
        </div>

        {/* Pie Chart */}
        <div className="flex items-center justify-center">
          <PieChart data={bloodStockData} />
        </div>
      </div>

      {/* Total Expected Donation Card */}
      <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 flex-1 min-w-[200px]">
        <p className="text-yellow-500 text-4xl font-bold">{totalexpecteddonation}</p>
        <p className="text-gray-600 text-lg">Total Expected Donation</p>
      </div>

      {/* Total Blood Stock Breakdown */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-gray-800">Total Blood Stock Breakdown</h2>
        <div className="flex flex-wrap gap-6">
          {bloodInventory?.data?.inventory.map((stock) => (
            <div
              key={stock.bloodType}
              className="flex flex-col justify-center items-center bg-gray-100 shadow-sm rounded-lg p-4 flex-1 min-w-[150px]"
            >
              <p className="text-xl font-bold text-red-700">{stock.bloodGroup}</p>
              <p className="text-lg font-medium text-gray-600">{stock.units} Units</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Donor Information */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-gray-800">Recent Donor Information</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Donor Name</th>
                <th className="border border-gray-300 px-4 py-2">Donation Date</th>
                <th className="border border-gray-300 px-4 py-2">Blood Type</th>
                <th className="border border-gray-300 px-4 py-2">Units Donated</th>
              </tr>
            </thead>
            <tbody>
              {recentDonors?.map((donor, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{donor?.donor?.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{donor?.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{donor?.donor?.bloodGroup}</td>
                  <td className="border border-gray-300 px-4 py-2">{donor?.VolumeCollected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
