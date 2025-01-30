// UnauthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => (
  <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-100">
    <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
    <p className="text-lg mb-4">You do not have permission to view this page.</p>
    <Link
      to="/login"
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Go to Login
    </Link>
  </div>
);

export default UnauthorizedPage;
