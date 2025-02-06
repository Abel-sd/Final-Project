import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Snackbar, Alert } from '@mui/material';
import useCreateHospital from '../hooks/UseCreateHospital';
import UseFetchAllHospital from '../hooks/UseFechAllHospital';
import LoadingPage from './LoadingPage';
import { useQueryClient } from '@tanstack/react-query';
import usedeletehospital from '../hooks/UseDeleteHospital';
import useCreateResetPassword from '../hooks/UseResetPassword';

export default function AdminHospital() {
  const queryClient = useQueryClient();
  const [hospitals, setHospitals] = useState([]);
  const [newHospital, setNewHospital] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    location: '', 
    contactInfo: '' 
  });
  
  const [openModal, setOpenModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'success'
  });

  // Create Hospital Mutation
  const { mutate, isPending } = useCreateHospital({
    onSuccess: () => {
      showSnackbar('Hospital added successfully!', 'success');
      queryClient.invalidateQueries('fetchAllHospital');
      resetForm();
    },
    onError: (error) => {
      showSnackbar(
        error.response?.data?.message || 'Failed to add hospital. Please try again.',
        'error'
      );
    }
  });
const {mutate:resetpassword}=useCreateResetPassword({
  onSuccess: () => {
    showSnackbar('Password reset successfully!', 'success');
    queryClient.invalidateQueries('fetchAllHospital');
  },
onError: (error) => {
  showSnackbar(
    error.response?.data?.message || 'Failed to reset password. Please try again.',
    'error'
  );
}

})
  // Delete Hospital Mutation
  const { mutate: deleteHospital } = usedeletehospital({
    onSuccess: () => {
      showSnackbar('Hospital deleted successfully!', 'success');
      queryClient.invalidateQueries('fetchAllHospital');
    },
    onError: (error) => {
      showSnackbar(
        error.response?.data?.message || 'Failed to delete hospital. Please try again.',
        'error'
      );
    }
  });

  const { data, isLoading, isError, error: fetchError } = UseFetchAllHospital();

  useEffect(() => {
    if (data?.data) {
      setHospitals(data.data.map(item => ({
        id: item._id,
        name: item.name,
        email: item.Auth?.email,
        location: item.address,
        contactInfo: item.phone,
      })));
    }
  }, [data]);

  const showSnackbar = (message, type) => {
    setSnackbar({ open: true, message, type });
  };

  const resetForm = () => {
    setNewHospital({ 
      name: '', 
      email: '', 
      password: '', 
      location: '', 
      contactInfo: '' 
    });
    setOpenModal(false);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const password = Array(8)
      .fill('')
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join('');
    setNewHospital(prev => ({ ...prev, password }));
  };

  const handleAddHospital = () => {
    const requiredFields = ['name', 'email', 'location', 'contactInfo', 'password'];
    const missingFields = requiredFields.filter(field => !newHospital[field]);

    if (missingFields.length > 0) {
      showSnackbar('All fields are required!', 'error');
      return;
    }

    mutate({
      auth: { email: newHospital.email, password: newHospital.password },
      hospital: {
        name: newHospital.name,
        address: newHospital.location,
        phone: newHospital.contactInfo,
      },
    });
  };

  const columns = [
    { field: 'name', headerName: 'Hospital Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'contactInfo', headerName: 'Contact Info', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 130,
      renderCell: (params) => (
        <button
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this hospital?')) {
              deleteHospital(params.row.id);
            }
          }}
        >
          Delete
        </button>
      ),
    },
    {
      field: 'recoverpassword', headerName: 'Recover Password', width: 200,renderCell: (params) => (
        <button
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          onClick={() => {
            if (window.confirm('Are you sure you want to recover password for this hospital?')) {
              resetpassword({email:params.row.email});
              console.log(params.row.email);
            }
          }}
        >
          Recover Password
        </button>
      ),
    }
  ];

  if (isLoading) return <LoadingPage />;

  if (isError) return (
    <div className="w-[90%] mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Hospital Management</h1>
      <div className="bg-gradient-to-r from-red-100 to-pink-100 p-6 rounded-xl shadow-lg text-center">
        <p className="text-red-600 text-xl font-semibold">
          Error fetching hospitals: {fetchError?.message || "Please try again later"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Hospital Management
        </h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all mb-8"
        >
          + Add New Hospital
        </button>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg" style={{ height: 400 }}>
          <DataGrid
            rows={hospitals}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8fafc',
                fontSize: '1rem'
              }
            }}
          />
        </div>

        {/* Add Hospital Modal */}
        {openModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-2xl w-96">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                New Hospital
              </h2>

              {['name', 'email', 'location', 'contactInfo'].map((field) => (
                <input
                  key={field}
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  placeholder={
                    field === 'contactInfo' ? 'Contact Info' : 
                    field[0].toUpperCase() + field.slice(1)
                  }
                  value={newHospital[field]}
                  onChange={(e) => setNewHospital(prev => ({ ...prev, [field]: e.target.value }))}
                  className="w-full p-3 mb-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ))}

              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  name="password"
                  value={newHospital.password}
                  placeholder="Password"
                  disabled
                  className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50"
                />
                <button
                  onClick={generatePassword}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Generate
                </button>
              </div>

              <div className="flex justify-between gap-4">
                <button
                  onClick={handleAddHospital}
                  disabled={isPending}
                  className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg shadow-md transition-all ${
                    isPending ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                  }`}
                >
                  {isPending ? 'Adding...' : 'Add Hospital'}
                </button>
                <button
                  onClick={() => setOpenModal(false)}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Snackbar Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            severity={snackbar.type}
            variant="filled"
            sx={{ width: '100%', fontWeight: 500 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}