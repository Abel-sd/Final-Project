import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import UseFetchBloodRequest from "../hooks/UseFechBloodRequest";
import usebloodrequest from "../hooks/UseCreateBloodRequest";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiDroplet, FiX } from "react-icons/fi";
import { Snackbar, Alert } from "@mui/material";

import useAxiosInstance from "../utils/Api";
import { useMutation } from "@tanstack/react-query";

export default function HospitalBloodRequest() {
  const [rows, setRows] = useState([]);
  const api = useAxiosInstance();
  
  const { data } = UseFetchBloodRequest();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ bloodType: "", units: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "" });

  useEffect(() => {
    if (data) {
      const formattedRows = data?.data.map((item, index) => ({
        no: index + 1,
        id: item._id,
        bloodGroup: item.bloodGroup,
        units: item.units,
        requestDate: new Date(item.date).toLocaleDateString(),
        status: item.IsApproved === "Approved" ? "Approved" : "Pending",
        IsGivenToPatient: item.IsGivenToPatient,
      }));
      setRows(formattedRows);
    }
  }, [data]);
const handleClose = () => { 

  setOpen(false);
  setFormData({ bloodType: "", units: "" });
};
  const { mutate } = usebloodrequest({
    onSuccess: () => {
      showSnackbar("Blood request submitted successfully!", "success");
      queryClient.invalidateQueries('fechAllBloodRequest');
      console.log("Blood request submitted successfully!");
      handleClose();
    },
    onError: (error) => {
      console.log("Failed to submit request", error);
      showSnackbar(error.response?.data?.message || "Failed to submit request", "error");
    }
  });
  // Status update mutation/updateIsPatientgiven/:id
  const { mutate:updategiventopatient, isPending } = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.put(`/bloodRequest/manage/updateIsPatientgiven/${id}`, {
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

  const showSnackbar = (message, type) => {
    setSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddRequest = (e) => {
    e.preventDefault();
    if (!formData.bloodType || !formData.units) {
      showSnackbar("Please fill all required fields", "error");
      return;
    }
    mutate({ bloodGroup: formData.bloodType, units: formData.units });
  };

  const handleChangeGivenToPatient = (id, value) => {
    
    updategiventopatient({id})

  };

  const columns = [
    { field: "no", headerName: "#", width: 70 },
    { field: "bloodGroup", headerName: "Blood Type", width: 150 },
    { field: "units", headerName: "Units", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <span className={`px-3 py-1 rounded-full text-sm ${
          params.value === "Approved" 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {params.value}
        </span>
      ),
    },
    { field: "requestDate", headerName: "Request Date", width: 180 },
    {
      field: "IsGivenToPatient",
      headerName: "Patient Delivery",
      width: 180,
      renderCell: (params) => (
        <select
          value={params.value ? "Yes" : "No"}
          onChange={(e) => handleChangeGivenToPatient(params.row.id, e.target.value === "Yes")}
          className={`px-3 py-1 rounded-full text-sm ${
            params.value 
              ? "bg-blue-100 text-blue-800 border border-blue-200" 
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <option value="Yes" className="bg-blue-50">Delivered</option>
          <option value="No" className="bg-red-50">Pending</option>
        </select>
      ),
    },
  ];

  return (
    <div className="w-[90%] mx-auto py-8 flex flex-col gap-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl
                 shadow-lg hover:shadow-xl transition-shadow w-fit flex items-center gap-2"
      >
        <FiPlus className="text-xl" />
        <span>New Blood Request</span>
      </motion.button>

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1e293b'
            }
          }}
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FiDroplet className="text-red-500" />
                  Request Blood
                </h2>
                <button 
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleAddRequest} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Type
                  </label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required 
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O+">O+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Units Required
                  </label>
                  <input
                    type="number"
                    name="units"
                    value={formData.units}
                    onChange={(e) => setFormData({...formData, units: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 5"
                    min="1"
                    required
                  />
                </div>

                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}