import React, { useState } from 'react';
import useCreateResetPasswordLink from '../hooks/UseCreateForgetpasswordLink';

export default function RequestForgetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState();
  const [error, setError] = useState();

  const {mutate}=useCreateResetPasswordLink({
    onSuccess: () => {
      setSuccess('Password reset link sent successfully!');
      setTimeout(() => {
        setSuccess('');
      }
      , 5000);
    },
    onError: (error) => {
      setError('Failed to send reset link. Please try again.');
        setTimeout(() => {
            setError('');
        }
        , 5000);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    await mutate({ email });
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      {
        success && (
            <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-4 text-center">
                {success}
            </div>
            )
      }
        {
            error && (
                <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center">
                    {error}
                </div>
                )
        }
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium">Enter your email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter your email"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
