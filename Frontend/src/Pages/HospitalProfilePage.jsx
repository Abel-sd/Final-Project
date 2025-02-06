import React, { useEffect, useState } from 'react';
import UseFetchMeHospital from '../hooks/UseFechMeHospital';

export default function HospitalProfilePage() {
 
   const { data: me } = UseFetchMeHospital();
  const [hospitalData, setHospitalData] = useState({
    name: '',
    location: '',
    contact: '',
    departments: '', 
  });
  
  useEffect(() => {
    if (me) {
      setHospitalData({
        name: me?.data?.name,
        location: me?.data?.address,
        contact: me?.data?.phone,
        departments: me?.data?.departments?.join(', '),
      });
    }
  }, [me]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHospitalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded shadow-lg">
      {/* Hospital Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Hospital Name</label>
        <input
          type="text"
          name="name"
          value={hospitalData.name}
          onChange={handleChange}
          className="w-full p-2 mt-2 border rounded"
          placeholder="Enter hospital name"
        />
      </div>

      {/* Hospital Location */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Location</label>
        <input
          type="text"
          name="location"
          value={hospitalData.location}
          onChange={handleChange}
          className="w-full p-2 mt-2 border rounded"
          placeholder="Enter hospital location"
        />
      </div>

      {/* Contact Information */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Contact</label>
        <input
          type="text"
          name="contact"
          value={hospitalData.contact}
          onChange={handleChange}
          className="w-full p-2 mt-2 border rounded"
          placeholder="Enter hospital contact number"
        />
      </div>


     
    </div>
  );
}
