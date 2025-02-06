import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import UseFetchAllDonor from "../hooks/UseFechAllDonor";
import LoadingPage from "./LoadingPage";
import usedeletedonor from "../hooks/UseDeleteDonor";
import { useQueryClient } from "@tanstack/react-query";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function AdminDoner() {
  const { data: donors, isLoading, isError, error: fetchError } = UseFetchAllDonor();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const queryClient = useQueryClient();

  // Delete Donor Mutation
  const { mutate: deleteDonor } = usedeletedonor({
    onSuccess: () => {
      setSnackbar({ open: true, message: "Donor deleted successfully!", type: "success" });
      queryClient.invalidateQueries("fetchAllDonors"); // Refresh donor list
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to delete donor. Please try again.",
        type: "error",
      });
    },
  });

  // Columns for DataGrid
  const columns = [
    { field: "name", headerName: "Donor Name", width: 180 },
    { field: "Auth", headerName: "Email", width: 220, renderCell: (params) => params.row.Auth?.email },
    { field: "phone", headerName: "Contact Info", width: 180 },
    { field: "bloodGroup", headerName: "Blood Type", width: 100 },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <button
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          onClick={() => deleteDonor(params.row._id)}
        >
          Delete
        </button>
      ),
    },
  ];

  // Handle Snackbar Close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Loading State
  if (isLoading) {
    return <LoadingPage />;
  }

  // Error State
  if (isError) {
    return (
      <div className="w-[90%] mx-auto flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Donor Management</h1>
        <div className="bg-gradient-to-r from-red-100 to-pink-100 p-6 rounded-xl shadow-lg text-center">
          <p className="text-red-600 text-xl font-semibold">
            Error fetching donors: {fetchError?.message || "An unexpected error occurred."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Donor Management</h1>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* DataGrid with Gradient Shadow */}
      <div
        className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl"
        style={{ height: 400, width: "100%" }}
      >
        <DataGrid
          rows={donors?.data || []}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row._id}
          disableSelectionOnClick
          sx={{
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            border: "none",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
        />
      </div>
    </div>
  );
}