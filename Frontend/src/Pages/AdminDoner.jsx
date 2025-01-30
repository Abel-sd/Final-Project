import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import UseFetchAllDonor from '../hooks/UseFechAllDonor';
import LoadingPage from './LoadingPage';



export default function AdminDoner() {

  const {data:donors,isLoading}=UseFetchAllDonor()
 
  


  const columns = [
    { field: 'name', headerName: 'Donor Name', width: 180 },
    { field: 'Auth', headerName: 'Email', width: 220,renderCell:(params)=>params.row.Auth?.email },
    { field: 'phone', headerName: 'Contact Info', width: 180 },
    { field: 'bloodGroup', headerName: 'Blood Type', width: 100 },
  ];
  if(isLoading){
    return <LoadingPage/>
  }

  return (
    <div className="w-[90%] mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Donor Management</h1>

      
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={donors?.data} columns={columns} pageSize={5}
      getRowId={
        (row) => row?._id
      } />
      </div>
    </div>
  );
}
