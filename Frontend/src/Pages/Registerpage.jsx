import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const registerDonor = async ({ name, email, phone, bloodGroup, password, age, gender }) => {
    const response = await axios.post('http://localhost:3000/api/donor/manage/create', {
      auth: {
        email: email,
        password: password,
      },
      donor: {
        name: name,
        phone: phone,
        bloodGroup: bloodGroup,
        age: age,
        gender: gender,
        address: 'Addis Ababa',
      },
    });
    return response.data;
  };

  const { mutate, isLoading, isError, error: mutationError } = useMutation({
    mutationFn: registerDonor,
    onSuccess: (data) => {
      console.log('Donor registration successful!', data);
      navigate('/login'); // Redirect to donor login after successful registration
    },
    onError: (error) => {
      console.log('Donor registration failed!', error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (name && email && phone && bloodGroup && password) {
      mutate({ name, email, phone, bloodGroup, password, age, gender });
    } else {
      setError('Please fill out all fields.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="w-full max-w-sm mx-auto p-6 border rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Donor Registration</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter your phone number"
              />blood group
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select your blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select your Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
          
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Confirm your password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your age"
            />
          </div>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 w-full bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        {isError && (
          <p className="text-red-600 text-sm mt-4">
            {mutationError?.message || 'An error occurred during registration.'}
          </p>
        )}
      </div>
    </div>
  );
}
