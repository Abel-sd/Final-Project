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

Modal.setAppElement('#root');

export default function DonerDashboard() {
  const { data, isLoading, isError, error } = UseFetchUserDonationReport();
  const { data: user, isLoading: userLoading } = UseFetchMe();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const columns = [
    { field: 'no', headerName: 'No', width: 100 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'units', headerName: 'Units Donated', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <div>
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
            {params.value}
          </span>
        </div>
      ),
    },
  ];

  const rows = data?.data?.recentDonation.map((donation, index) => ({
    no: index + 1,
    id: index,
    date: donation.date,
    location: donation.location,
    units: donation.units,
    status: donation.status,
  }));

  const lastDonationDate = user?.data[0]?.lastDonationDate || null;
  const remainingDaysAfter40DaysRest = lastDonationDate
    ? Math.floor(
        (new Date(lastDonationDate).getTime() +
          40 * 24 * 60 * 60 * 1000 -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { mutate } = usecreateschedule({
    onSuccess: (data) => {
      setSnackbar({
        open: true,
        message: 'Donation Scheduled Successfully!',
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
    mutate({ date: selectedDate });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto p-6">
      {/* Header Section */}
      <div className="w-full relative h-[300px] mt-8 bg-gradient-to-l from-red-700 to-pink-500 shadow-2xl rounded-2xl relative overflow-hidden flex flex-col items-center justify-center">

  <div className="relative z-1 text-center text-white">
    <p className="text-4xl font-extrabold leading-tight mb-2 drop-shadow-lg">
      👋 Welcome, <span className="text-yellow-400">{user?.data[0]?.name}</span>
    </p>
    <p className="text-2xl font-medium drop-shadow-sm">
      Thank you for supporting Ethiopian Red Cross
    </p>
  </div>

  {/* Blood Bank Message */}
  <div className="relative z-10 text-center text-white mt-6 mb-8">
    <p className="text-lg font-semibold opacity-90">
      Every donation saves a life! Join us in making a difference.
    </p>
  </div>

  {/* Donate Button */}
  <div className="absolute bottom-6 w-full flex justify-center">
    <button
      className="px-10 py-4 bg-yellow-500 text-white font-semibold text-xl rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
      onClick={openModal}
    >
      Donate Now
    </button>
  </div>
</div>



      {/* Donation Stats Section */}
      <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col justify-center items-center bg-white shadow-xl rounded-lg p-6">
          <p className="text-red-600 text-[36px] font-bold">{data?.data?.totalDonation}</p>
          <p className="text-zinc-600 text-[18px] font-medium">Units of Blood Donated</p>
        </div>

        <div className="flex flex-col justify-center items-center bg-white shadow-xl rounded-lg p-6">
          <p className="text-yellow-500 text-[36px] font-bold">{remainingDaysAfter40DaysRest} Days</p>
          <p className="text-zinc-600 text-[18px] font-medium">Next Donation Eligibility</p>
        </div>
      </div>

      {/* Donation History Section */}
      <div className="w-full mt-8 bg-white shadow-xl rounded-lg p-6 overflow-x-auto">
        <h3 className="text-2xl font-semibold text-zinc-800 mb-4">Donation History</h3>
        <div className="w-full h-[400px]">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </div>
      </div>

      {/* Modal for Scheduling Donation */}
      <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel="Schedule Donation"
  className="bg-white p-6 rounded-xl shadow-2xl max-w-md mx-auto mt-[160px] relative z-10"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50"
>
  <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Schedule Your Donation</h2>

  <div className="mb-6 flex justify-center">
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      inline
      className="w-full p-3 border-2 border-blue-500 rounded-lg shadow-md hover:border-blue-600 transition-all"
    />
  </div>

  <div className="mt-8 flex justify-end gap-4">
    <button
      className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
      onClick={closeModal}
    >
      Cancel
    </button>
    <button
      className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300"
      onClick={handleSchedule}
    >
      Schedule
    </button>
  </div>

  {/* Decorative Elements */}
  <div className="absolute top-5 left-5 w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 opacity-20 rounded-full blur-3xl"></div>
  <div className="absolute bottom-5 right-5 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-20 rounded-full blur-3xl"></div>
</Modal>


      {/* Snackbar for Success/Error Message */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
