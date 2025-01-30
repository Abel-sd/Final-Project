import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation } from "@tanstack/react-query";
import UseFetchAllBloodRequest from "../hooks/UseFechAllBloodRequest";
import useAxiosInstance from "../utils/Api";
import LoadingPage from "./LoadingPage";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminBloodRequest() {
  const [rows, setRows] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });

  const { data, isFetching } = UseFetchAllBloodRequest();

  useEffect(() => {
    if (data) {
      setRows(
        data?.data?.map((item) => ({
          id: item?._id,
          bloodType: item.bloodGroup,
          units: item.units,
          requestDate: new Date(item.date).toLocaleDateString(), // Format date
          status: item.IsApproved,
        }))
      );
    }
  }, [data, isFetching]);

  const api = useAxiosInstance();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["bloodrequest"],
    mutationFn: async ({ id, status }) => {
      const response = await api.put(`/bloodRequest/manage/updateApproval/${id}`, {
        IsApproved: status,
      });
      return response.data;
    },
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Status Updated Successfully!",
        severity: "success",
      });
      queryClient.invalidateQueries("fechAllBloodRequest");
    },
    onError: (error) => {
     
      setSnackbar({
        open: true,
        message: error?.response?.data?.error || "Error Updating Status!",
        severity: "error",
      });
    },
  });

  const handleChangeStatus = (id, value, currentStatus) => {

    if (value === "Pending") {
      setSnackbar({
        open: true,
        message: "You cannot set the status to pending!",
        severity: "error",
      });
      return;
    }
    // Prevent rejecting an already approved request
    if (currentStatus === "Approved" && value === "Rejected") {
      setSnackbar({
        open: true,
        message: "You cannot reject an approved request!",
        severity: "error",
      });
      return;
    }

    // Prevent approving a rejected request
    if (currentStatus === "Rejected" && value === "Approved") {
      setSnackbar({
        open: true,
        message: "You cannot approve a rejected request!",
        severity: "error",
      });
      return;
    }

    mutation.mutate({ id, status: value });

  
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "bloodType", headerName: "Blood Type", width: 150 },
    { field: "units", headerName: "Units", width: 100 },
    { field: "requestDate", headerName: "Request Date", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <select
          value={params.value}
          onChange={(e) => handleChangeStatus(params.row.id, e.target.value, params.value)}
          style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      ),
    },
  ];

  if (isFetching) {
    return <LoadingPage />;
  }

  return (
    <div className="w-[90%] mx-auto flex flex-col gap-6">
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
