import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import UseFetchBloodRequest from "../hooks/UseFechBloodRequest";
import usebloodrequest from "../hooks/UseCreateBloodRequest";
import { useQueryClient } from "@tanstack/react-query";

export default function HospitalBloodRequest() {
  const [rows, setRows] = useState([
    
  ]);
  const {data}=UseFetchBloodRequest()
  const queryclinet=useQueryClient()
  useEffect(() => {
    if (data) {
      const formattedRows = data?.data.map((item,index) => ({
        no: index + 1,
        id: item._id, // Ensure 'id' is provided for DataGrid
        bloodGroup: item.bloodGroup,
        units: item.units,
        requestDate: new Date(item.date).toLocaleDateString(), // Format date
        status: item.IsApproved ==="Approved" ? "Approved" : "Pending",
        IsGivenToPatient: item.IsGivenToPatient,
      }));
      setRows(formattedRows);
    }
  }, [data]);
  

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    bloodType: "",
    units: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const {mutate}=usebloodrequest({
    onSuccess:(data)=>{
      console.log('Blood Requested',data)
      queryclinet.invalidateQueries('fechAllBloodRequest')
    },
    onError:(error)=>{
      console.log('Blood Request failed',error)
    }
  })
  const handleAddRequest = () => {
    const newRequest = {
      id: rows.length + 1,
      bloodGroup: formData.bloodType,
      units: formData.units,
      requestDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      givenToPatient: "No",
    };
    mutate({
      bloodGroup: formData.bloodType,
      units: formData.units
     
    })  
    
    setFormData({ bloodType: "", units: "" });
    handleClose();
  };

  const handleChangeGivenToPatient = (id, value) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, givenToPatient: value } : row
      )
    );
  };

const columns = [
  { field: "no", headerName: "ID", width: 70 },
  { field: "bloodGroup", headerName: "Blood Type", width: 150 },
  { field: "units", headerName: "Units", width: 100 },
  { field: "status", headerName: "Approved", width: 100 },
  { field: "requestDate", headerName: "Request Date", width: 200 },
  {
    field: "IsGivenToPatient",
    headerName: "Given To Patient",
    width: 150,
    renderCell: (params) => (
      <select
        value={params.value ? "Yes" : "No"}
        onChange={(e) =>
          handleChangeGivenToPatient(params.row._id, e.target.value === "Yes")
        }
        className="px-3 py-1 border bg-zinc-100 rounded"
      >
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    ),
  },
];


  return (
    <div className="w-[90%] mx-auto flex flex-col gap-6">
      <button
        className="px-4 py-2 w-[200px] bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleOpen}
      >
        Add Request
      </button>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>

      {open && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center"
          onClick={handleClose}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Request Blood to ERC</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 text-gray-700">Blood Type</label>
                <input
                  type="text"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., A+"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">Units</label>
                <input
                  type="number"
                  name="units"
                  value={formData.units}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 5"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleAddRequest}
                >
                  Add Request
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
