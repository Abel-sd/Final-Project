import React from 'react';
import UseFetchMeHospital from '../hooks/UseFechMeHospital';
import UseFetchBloodRequest from '../hooks/UseFechBloodRequest';
import { GiBlood, GiHeartBeats } from 'react-icons/gi';
import { motion } from 'framer-motion';

export default function HospitalDashboard() {
  const { data } = UseFetchMeHospital();
  const { data: blood } = UseFetchBloodRequest();
  
  const totalpending = blood?.data.filter((item) => item.IsApproved === "Pending").length;
  const totalAvailableUnits = data?.data?.AvailableBlood?.reduce((acc, item) => acc + item.units, 0);

  // Blood type color mapping
  const bloodTypeColors = {
    'A+': 'from-red-600 to-red-400',
    'B+': 'from-blue-600 to-blue-400',
    'AB+': 'from-purple-600 to-purple-400',
    'O+': 'from-green-600 to-green-400',
    'A-': 'from-red-800 to-red-600',
    'B-': 'from-blue-800 to-blue-600',
    'AB-': 'from-purple-800 to-purple-600',
    'O-': 'from-green-800 to-green-600',
  };

  return (
    <div className="w-[90%] mx-auto flex flex-col gap-8 py-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-64 flex flex-col justify-center items-center rounded-2xl bg-gradient-to-r from-red-600 to-red-500 shadow-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
        <GiHeartBeats className="text-white/10 text-9xl absolute right-8 -top-8" />
        <h1 className="text-white text-4xl font-bold text-center mb-2 drop-shadow-lg z-10">
          Welcome to BloodCare Hub
        </h1>
        <p className="text-white/90 text-lg text-center z-10">
          Managing Life-Saving Resources
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-white to-red-50 p-6 rounded-2xl shadow-lg flex items-center gap-6"
        >
          <div className="bg-red-100 p-4 rounded-xl">
            <GiBlood className="text-red-600 text-4xl" />
          </div>
          <div>
            <p className="text-3xl font-bold text-red-600">{totalAvailableUnits}</p>
            <p className="text-gray-600 mt-1">Total Blood Units</p>
            <span className="text-sm text-red-500">Available in Stock</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg flex items-center gap-6"
        >
          <div className="bg-blue-100 p-4 rounded-xl">
          
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">{totalpending}</p>
            <p className="text-gray-600 mt-1">Pending Requests</p>
            <span className="text-sm text-blue-500">Awaiting Approval</span>
          </div>
        </motion.div>
      </div>

      {/* Blood Inventory */}
      <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <GiBlood className="text-red-600" />
          Blood Inventory
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data?.data?.AvailableBlood?.map((stock) => (
            <motion.div 
              key={stock.bloodGroup}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-xl shadow-md ${bloodTypeColors[stock.bloodGroup]} bg-gradient-to-br text-white`}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{stock.bloodGroup}</span>
                <span className="text-lg">{stock.units} Units</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity (You can add this section later) */}
      {/* <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <GiHeartBeats className="text-blue-600" />
          Recent Activity
        </h2>
        <div className="text-gray-500 text-center py-8">
          <p>Activity feed coming soon...</p>
        </div>
      </div> */}
    </div>
  );
}