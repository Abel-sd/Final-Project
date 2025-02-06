// src/hooks/useCreateResetPasswordLink.js
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const createResetPasswordLink = async (email) => {
  const response = await axios.post('http://localhost:3000/api/user/auth/request/reset', email);
  return response.data;
};

const useCreateResetPasswordLink = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createResetPasswordLink,
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      } else {
        console.log('ResetPasswordLink  successful!', data);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      } else {
        console.log('ResetPasswordLink failed!', error);
      }
    },
  });
};

export default useCreateResetPasswordLink;
