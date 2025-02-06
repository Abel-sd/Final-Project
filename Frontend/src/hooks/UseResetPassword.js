// src/hooks/useCreateResetPassword.js
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const createResetPassword = async (email) => {
  const response = await axios.post('http://localhost:3000/api/user/auth/reset', email);
  return response.data;
};

const useCreateResetPassword = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createResetPassword,
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      } else {
        console.log('ResetPassword  successful!', data);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      } else {
        console.log('ResetPassword failed!', error);
      }
    },
  });
};

export default useCreateResetPassword;
