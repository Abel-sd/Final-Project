import React, { useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation } from "@tanstack/react-query";
import UseFetchAllBloodRequest from "../hooks/UseFechAllBloodRequest";
import useAxiosInstance from "../utils/Api";
import LoadingPage from "./LoadingPage";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminBloodRequest() {
  const queryClient = useQueryClient();
  const api = useAxiosInstance();
  const [snackbar, setSnackbar] = React.useState({ 
    open: false, 
    message: "", 
    severity: "info" 
  });

  // Fetch blood requests
  const { data, isFetching, isError, error } = UseFetchAllBloodRequest();

  // Memoized row data
  const rows = useMemo(() => 
    data?.data?.map(item => ({
      id: item?._id,
      bloodType: item.bloodGroup,
      units: item.units,
      requestDate: new Date(item.date).toLocaleDateString(),
      status: item.IsApproved,
    })) || [],
    [data]
  );

  // Status update mutation/updateIsPatientgiven/:id
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.put(`/bloodRequest/manage/updateApproval/${id}`, {
        IsApproved: status,
      });
      return response.data;
    },
    onSuccess: () => {
      showSnackbar("Status updated successfully!", "success");
      queryClient.invalidateQueries("fechAllBloodRequest");
    },
    onError: (error) => {
      showSnackbar(
        error?.response?.data?.error || "Failed to update status. Please try again.",
        "error"
      );
    },
  });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleChangeStatus = (id, value, currentStatus) => {
    const validationRules = {
    
      Approved: (newStatus) => 
        currentStatus === "Approved" && newStatus === "Rejected" 
          ? "Cannot reject approved request!" 
          : null,
      Rejected: (newStatus) => 
        currentStatus === "Rejected" && newStatus === "Approved" 
          ? "Cannot approve rejected request!" 
          : null,
    };

    const errorMessage = validationRules[value]?.(value) || validationRules[currentStatus]?.(value);
    if (errorMessage) {
      showSnackbar(errorMessage, "error");
      return;
    }

    mutate({ id, status: value });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "bloodType", headerName: "Blood Type", width: 150 },
    { field: "units", headerName: "Units", width: 100 },
    { field: "requestDate", headerName: "Request Date", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      renderCell: (params) => (
        <select
          value={params.value}
          onChange={(e) => handleChangeStatus(params.row.id, e.target.value, params.value)}
          disabled={isPending}
          className={`px-3 py-1 rounded-md border ${
            isPending ? 'bg-gray-100 cursor-not-allowed' : 
            params.value === 'Approved' ? 'border-green-500 bg-green-50' :
            params.value === 'Rejected' ? 'border-red-500 bg-red-50' :
            'border-yellow-500 bg-yellow-50'
          } focus:ring-2 focus:outline-none`}
        >
          <option value="Pending" className="bg-yellow-50">Pending</option>
          <option value="Approved" className="bg-green-50">Approved</option>
          <option value="Rejected" className="bg-red-50">Rejected</option>
        </select>
      ),
    },
  ];

  if (isFetching) return <LoadingPage />;

  if (isError) return (
    <div className="w-[90%] mx-auto p-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl shadow-lg">
      <p className="text-red-600 text-center text-xl font-semibold">
        Error loading requests: {error?.message || "Please try again later"}
      </p>
    </div>
  );

  return (
    <div className="w-[90%] mx-auto flex flex-col gap-8 py-8">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Blood Request Management
        </h1>

        <div className="bg-white rounded-lg shadow-inner" style={{ height: 500 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            loading={isPending}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8fafc',
                fontSize: '1rem'
              }
            }}
            getRowClassName={(params) => 
              `status-${params.row.status.toLowerCase()} 
              ${isPending ? 'opacity-50' : ''}`
            }
          />
        </div>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
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