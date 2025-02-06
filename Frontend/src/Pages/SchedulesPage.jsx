import React, { useEffect, useState } from "react";
import UseFetchAllScheduledBlood from "../hooks/UseFechScheduledBlood";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosInstance from "../utils/Api";
import { DataGrid } from "@mui/x-data-grid";
import LoadingPage from "./LoadingPage";
import { Snackbar, Alert } from "@mui/material"; // Import MUI Snackbar and Alert

export default function SchedulesPage() {
  const [modal, setModal] = useState({
    isOpen: false,
    scheduleId: null,
    totalUnitsCollected: "",
  });

  const { data, isLoading } = UseFetchAllScheduledBlood();
  const [schedules, setSchedules] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // Can be 'success' or 'error'
  });

  const queryClient = useQueryClient();
  const api = useAxiosInstance();

  useEffect(() => {
    if (data) {
      setSchedules(data?.data);
    }
  }, [data]);

  const completeScheduleMutation = useMutation({
    mutationFn: async ({ id, VolumeCollected }) => {
      return await api.put(`/schedule/manage/completeSchedule/${id}`, {
        VolumeCollected,
      });
    },
    mutationKey: ["completeSchedule"],
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Schedule marked as completed successfully!",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error: ${error.response?.data?.message || "Something went wrong"}`,
        severity: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries("fechAllScheduledBlood");
      handleCloseModal();
    },
  });

  const handleToggleCompletion = (id) => {
    const schedule = schedules.find((s) => s._id === id);
    if (schedule.Iscollected) return;

    setModal({
      isOpen: true,
      scheduleId: id,
      totalUnitsCollected: schedule.VolumeCollected || "",
    });
  };

  const handleModalChange = (e) => {
    setModal((prev) => ({
      ...prev,
      totalUnitsCollected: e.target.value,
    }));
  };

  const handleSaveUnits = () => {
    completeScheduleMutation.mutate({
      id: modal.scheduleId,
      VolumeCollected: modal.totalUnitsCollected,
    });
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false, scheduleId: null, totalUnitsCollected: "" });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    {
      field: "donor",
      headerName: "Donor Name",
      flex: 1,
      renderCell: (params) => params.row.donor?.name,
    },
    { field: "date", headerName: "Schedule Date", flex: 1 },
    {
      field: "Iscollected",
      headerName: "Completed",
      flex: 1,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    { field: "VolumeCollected", headerName: "Total Units Collected", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-center">
          <button
            className={`px-4  flex items-center h-[30px] rounded ${
              params.row.Iscollected
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
            onClick={() => handleToggleCompletion(params.row._id)}
          >
            {params.row.Iscollected ? "Completed" : "Mark as Completed"}
          
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-[90%] mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Blood Donation Schedules</h1>

      <div className="h-[400px]">
        <DataGrid
          rows={schedules}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
        />
      </div>

      {modal.isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">Edit Units Collected</h2>
            <input
              type="number"
              value={modal.totalUnitsCollected}
              onChange={handleModalChange}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSaveUnits}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar for showing success or error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
