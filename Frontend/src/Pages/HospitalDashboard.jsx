import React from 'react';
import UseFetchMeHospital from '../hooks/UseFechMeHospital';
import UseFetchBloodRequest from '../hooks/UseFechBloodRequest';
import UseFetchAllScheduledBlood from '../hooks/UseFechScheduledBlood';

export default function HospitalDashboard() {
 
 
const {data}=UseFetchMeHospital()
const {data:blood}=UseFetchBloodRequest()
// const {data:schedule}=UseFetchAllScheduledBlood()
// const totalexpecteddonation=schedule?.data.filter((item)=>item.Iscollected===false).length
const totalpending=blood?.data.filter((item)=>item.IsApproved==="Pending").length
  
const totalAvailableUnits=data?.data[0]?.AvailableBlood?.reduce((acc, item) => acc + item.units, 0)

  return (
    <div className="w-[90%] mx-auto flex flex-col gap-8">
      {/* Header Section */}
      <div className="w-full h-[250px] flex flex-col justify-center items-center rounded-lg bg-gradient-to-r from-red-700 to-zinc-500 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-500 opacity-20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-300 opacity-20 rounded-full blur-2xl"></div>
        <p className="text-white text-[40px] font-extrabold text-center drop-shadow-md">
          👋 Welcome to the Hospital Dashboard
        </p>
        <p className="text-white text-[22px] text-center mt-2 drop-shadow-sm">
          Ensuring Every Drop Saves Lives
        </p>
      </div>

      {/* Statistics Section */}
      <div className="flex flex-wrap justify-between items-stretch gap-6">
        <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 flex-1 min-w-[200px]">
          <p className="text-red-600 text-4xl font-bold">{totalAvailableUnits}</p>
          <p className="text-gray-600 text-lg">Total Units Collected</p>
        </div>
        <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 flex-1 min-w-[200px]">
          <p className="text-green-600 text-4xl font-bold">{totalpending}</p>
          <p className="text-gray-600 text-lg">Total Pending  Blood Requests to Erc</p>
        </div>
        {/*  */}
      </div>

      {/* Blood Stock Levels */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-gray-800">Blood Stock Levels</h2>
        <div className="flex flex-wrap gap-6">
          {data?.data[0]?.AvailableBlood?.map((stock) => (
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

  
    </div>
  );
}
