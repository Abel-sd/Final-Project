import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Snackbar, Alert } from '@mui/material'; // Import Snackbar and Alert components
import useCreateHospital from '../hooks/UseCreateHospital';
import UseFetchAllHospital from '../hooks/UseFechAllHospital';
import LoadingPage from './LoadingPage';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminHospital() {
  const [hospitals, setHospitals] = useState([]);
  const [newHospital, setNewHospital] = useState({ name: '', email: '', password: '', location: '', contactInfo: '' });
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const [snackbarType, setSnackbarType] = useState('success'); 
const queryclinet=useQueryClient()

  const { mutate, isPending } = useCreateHospital({
    onSuccess: () => {
      setSuccess('Hospital Added Successfully!');
      setSnackbarType('success'); 
      queryclinet.invalidateQueries('fechAllHospital')
      
      setOpenSnackbar(true); 
      setNewHospital({ name: '', email: '', password: '', location: '', contactInfo: '' });
      setOpenModal(false);
    },
    onError: (error) => {
      setError(error.response.data.message || 'An error occurred!');
      setSnackbarType('error'); 
      setOpenSnackbar(true); 
    }
  });

  const { data, isLoading } = UseFetchAllHospital();

  useEffect(() => {
    if (data) {
      const formattedHospitals = data.data.map((item) => ({
        id: item._id,
        name: item.name,
        email: item.Auth?.email,
        location: item.address,
        contactInfo: item.phone,
      }));
      setHospitals(formattedHospitals);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHospital({ ...newHospital, [name]: value });
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const password = Array(8)
      .fill('')
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join('');
    setNewHospital({ ...newHospital, password });
  };

  const handleAddHospital = () => {
    if (!newHospital.name || !newHospital.email || !newHospital.location || !newHospital.contactInfo || !newHospital.password) {
      setError('All fields are required!');
      setSnackbarType('error'); // Set snackbar type
      setOpenSnackbar(true); 
      return;
    }
    mutate({
      auth: {
        email: newHospital.email,
        password: newHospital.password,
      },
      hospital: {
        name: newHospital.name,
        address: newHospital.location,
        phone: newHospital.contactInfo,
      },
    });
  };

  const columns = [
    { field: 'name', headerName: 'Hospital Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'contactInfo', headerName: 'Contact Info', width: 180 },
  ];

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); 
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Hospital Management</h1>

      <button
        onClick={() => setOpenModal(true)}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-4"
      >
        Add New Hospital
      </button>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={hospitals} columns={columns} pageSize={5} />
      </div>

      {openModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-center mb-4">Add New Hospital</h2>

            <input
              type="text"
              name="name"
              placeholder="Hospital Name"
              value={newHospital.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newHospital.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={newHospital.location}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              name="contactInfo"
              placeholder="Contact Info"
              value={newHospital.contactInfo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-3"
            />
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                name="password"
                value={newHospital.password}
                placeholder="Password"
                disabled
                className="w-full p-2 border rounded"
              />
              <button
                onClick={generatePassword}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Generate
              </button>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleAddHospital}
                className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ${
                  isPending && 'opacity-50 cursor-not-allowed'
                }`}
                disabled={isPending}
              >
                {isPending ? 'Adding...' : 'Add Hospital'}
              </button>
              <button
                onClick={() => setOpenModal(false)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

   
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarType} sx={{ width: '100%' }}>
          {snackbarType === 'success' ? success : error}
        </Alert>
      </Snackbar>
    </div>
  );
}
