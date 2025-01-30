import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { roRO } from '@mui/material/locale';
import {  Link, redirect, useNavigate } from 'react-router-dom';
export default function LoginPage() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const signIn = useSignIn();
  const Navigate = useNavigate();
  const loginUser = async ({ email, password }) => {
    const response = await axios.post('http://localhost:3000/api/user/auth/login', { email, password });
    return response.data;
  };
  
  const { mutate, isLoading, isError, error: mutationError } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log('Login successful!', data);
      if(signIn({
        auth: {
            token: data.data.token,
            type: 'Bearer'
        },
        userState: {
            email: data.data.email,
            uid: data.data.id,
            role: data.data.role
        }
    })){

      redirect.map((item)=>{
        if(item.role===data.data.role){
          Navigate(item.redirect)
        }
      })
    }else {
       console.log('Login failed!', error);
    }
    },
    onError: (error) => {
    
    },
  });
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      mutate({ email, password });
    } else {
      setError('Please fill out both email and password.');
    }
  };
const redirect=[
  {
    role:'Doner',
    redirect:'/'
  },
  {
    role:'Hospital',
    redirect:'/hospital-dashboard'
  },
  {
    role:'Admin',
    redirect:'/admin-dashboard'
  }
]
  return (
    <div className="w-screen h-screen bg-white flex flex-col justify-center items-center">
      <div className="w-full max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email"
            />
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

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 w-full bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          <Link to="/register" className="text-center block mt-4 text-blue-600">Don't have an account? Register</Link>
        </form>

        {isError && (
          <p className="text-red-600 text-sm mt-4">
            {mutationError?.message || 'An error occurred during login.'}
          </p>
        )}
      </div>
    </div>
  );
}
