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
    <div className="w-[90%] mx-auto flex flex-col gap-8 py-8">
    {/* Overview Cards Section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { 
          title: 'Total Donations',
          value: recentDonors?.length,
          gradient: 'from-pink-100 to-red-100',
          text: 'text-red-600'
        },
        { 
          title: 'Total Blood Stock',
          value: bloodInventory?.data?.totalUnits,
          gradient: 'from-green-100 to-emerald-100',
          text: 'text-green-600'
        },
        { 
          title: 'Registered Donors / Hospitals',
          value: `${Donors?.data?.length} / ${hospital?.data?.length}`,
          gradient: 'from-blue-100 to-cyan-100',
          text: 'text-blue-600'
        },
      ].map((card, index) => (
        <div 
          key={index}
          className={`bg-gradient-to-r ${card.gradient} shadow-lg rounded-xl p-6 transform transition-all hover:shadow-xl hover:-translate-y-1`}
        >
          <p className={`${card.text} text-4xl font-bold mb-2`}>{card.value}</p>
          <p className="text-gray-600 text-lg font-medium">{card.title}</p>
        </div>
      ))}
    </div>

    {/* Low Stock Alert */}
    {lowStockAlert && (
      <div className="bg-gradient-to-r from-yellow-300 to-orange-300 p-4 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-black text-lg font-bold text-center md:text-left">
          ⚠️ Low Stock Alert: {lowStockBloodGroups.join(', ')} below {lowStockThreshold} units
        </p>
        <button
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          onClick={handleAlertClick}
          disabled={isPending}
        >
          {isPending ? 'Sending...' : 'Alert Donors'}
        </button>
      </div>
    )}

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Blood Stock Distribution</h3>
        <BloodStockChart hospitals={hospital?.data || []} />
      </div>
      
      <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Blood Group Proportions</h3>
        <PieChart data={bloodStockData} />
      </div>
    </div>

    {/* Total Expected Donation */}
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg rounded-xl p-6 transform transition-all hover:shadow-xl">
      <p className="text-white text-4xl font-bold">{totalexpecteddonation}</p>
      <p className="text-yellow-100 text-lg font-medium">Total Expected Donations</p>
    </div>

    {/* Blood Stock Breakdown */}
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Blood Stock Breakdown</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bloodInventory?.data?.inventory.map((stock) => (
          <div
            key={stock.bloodGroup}
            className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <p className="text-2xl font-bold text-red-700 mb-1">{stock.bloodGroup}</p>
            <p className="text-lg text-gray-600">{stock.units} Units</p>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Donors Table */}
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden">
      <h2 className="text-2xl font-bold text-gray-800 p-6">Recent Donations</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
            <tr>
              {['Donor Name', 'Donation Date', 'Blood Type', 'Units Donated'].map((header, index) => (
                <th 
                  key={index}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentDonors?.map((donor, index) => (
              <tr 
                key={index}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-800 font-medium">{donor?.donor?.name}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(donor?.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    {donor?.donor?.bloodGroup}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-700">{donor?.VolumeCollected}ml</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
}
