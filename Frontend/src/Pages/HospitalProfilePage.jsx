import React, { useState } from 'react';

export default function HospitalProfilePage() {
  // Initialize state for hospital profile data
  const [hospitalData, setHospitalData] = useState({
    name: 'St. Mary\'s Hospital',
    location: '123 Health St., Wellness City, HC 45678',
    contact: '(123) 456-7890',
    departments: 'Cardiology, Neurology, Pediatrics, Orthopedics', // Example as a comma-separated string
  });

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


      {/* Submit Button */}
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}
