import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import UseFetchUserDonationReport from '../hooks/UseFechUserDonationReport';
import UseFetchMe from '../hooks/UseFechMe';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import usecreateschedule from '../hooks/UseCreateSchedule';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FiDroplet, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';

Modal.setAppElement('#root');

export default function DonerDashboard() {
  const { data, isLoading, isError, error } = UseFetchUserDonationReport();
  const { data: user, isLoading: userLoading } = UseFetchMe();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [location, setLocation] = useState('Addis Ababa');

  const columns = [
    { field: 'no', headerName: 'No', width: 100 },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center text-gray-600">
          <FiCalendar className="mr-2 text-red-500" />
          {params.value}
        </div>
      )
    },
    { 
      field: 'location', 
      headerName: 'Location', 
      width: 180,
      renderCell: (params) => (
        <div className="flex items-center text-gray-600">
          <FiMapPin className="mr-2 text-red-500" />
          {params.value}
        </div>
      )
    },
    { 
      field: 'units', 
      headerName: 'Units', 
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center text-gray-600">
          <FiDroplet className="mr-2 text-red-500" />
          {params.value}
        </div>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <span className={`px-3 py-1 rounded-full text-sm ${
          params.value === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {params.value}
        </span>
      ),
    },
  ];

  const rows = data?.data?.recentDonation?.map((donation, index) => ({
    no: index + 1,
    id: index,
    date: new Date(donation.date).toLocaleDateString(),
    location: donation.location,
    units: donation.VolumeCollected,
    status: "completed",
  })) || [];

  const lastDonationDate = user?.data?.lastDonationDate || null;
  const remainingDays = lastDonationDate
    ? Math.max(0, Math.floor(
        (new Date(lastDonationDate).getTime() +
          40 * 24 * 60 * 60 * 1000 -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      ))
    : 0;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { mutate } = usecreateschedule({
    onSuccess: (data) => {
      setSnackbar({
        open: true,
        message: 'Donation Scheduled Successfully! 🎉',
        severity: 'success',
      });
      closeModal();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error?.response?.data || 'Error scheduling donation.',
        severity: 'error',
      });
    },
  });

  const handleDateChange = (date) => setSelectedDate(date);

  const handleSchedule = () => {
    mutate({ date: selectedDate, location: location });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <div className="w-full relative max-w-screen-xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-96 rounded-3xl bg-gradient-to-br from-red-600 to-rose-500 shadow-2xl overflow-hidden">
        <div className="absolute z-20 inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="z-10 text-white space-y-4">
            <h1 className="text-4xl z-20 md:text-5xl font-bold">
              Welcome Back, {user?.data?.name}!
            </h1>
            <p className="text-xl text-rose-100">
              Your donations have helped save {data?.data?.totalDonation * 3} lives
            </p>
          </div>
          
          <div className="absolute bottom-8 w-full flex justify-center">
            <button
              onClick={openModal}
              className="z-2 px-8 py-3 bg-white text-red-600 font-semibold rounded-full shadow-lg
                       transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Schedule New Donation
            </button>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="animate-blob animation-delay-2000 absolute w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 -top-20 -left-20"></div>
          <div className="animate-blob animation-delay-4000 absolute w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 top-1/2 left-1/4"></div>
          <div className="animate-blob absolute w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 -top-20 right-0"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <FiDroplet className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {data?.data?.totalDonation || 0}
              </p>
              <p className="text-gray-600">Total Donations</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {remainingDays}
              </p>
              <p className="text-gray-600">Days Until Next Donation</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <FiCalendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {rows.length}
              </p>
              <p className="text-gray-600">Completed Donations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Donation History */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">Donation History</h3>
        </div>
        <div className="h-[400px] w-full">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            loading={isLoading}
            sx={{
              border: 0,
              '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f3f4f6',
                fontSize: '1rem',
              },
            }}
          />
        </div>
      </div>

      {/* Schedule Donation Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Schedule Donation"
        className="bg-white p-8 z-[40] absolute rounded-2xl shadow-2xl max-w-md mx-auto mt-20  top-0 border border-gray-100"
        overlayClassName="fixed z-[40] inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      >
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Schedule Donation</h2>
            <p className="text-gray-600 mt-2">Choose date and location</p>
          </div>

          <div className="space-y-4">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              inline
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-200 rounded-lg bg-white appearance-none 
                         focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Dire Dawa">Dire Dawa</option>
                <option value="Mekelle">Mekelle</option>
                <option value="Bahir Dar">Bahir Dar</option>
                <option value="Gondar">Gondar</option>
                <option value="Harar">Harar</option>
                <option value="Jimma">Jimma</option>
                <option value="Adama">Adama</option>
              </select>
              <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={closeModal}
              className="px-5 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Schedule Now
            </button>
          </div>
        </div>
      </Modal>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ 
            '&.MuiAlert-filledSuccess': { backgroundColor: '#16a34a' },
            '&.MuiAlert-filledError': { backgroundColor: '#dc2626' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}