// src/hooks/useCreateNewPassword.js
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const createNewPassword = async (data) => {
  const response = await axios.post('http://localhost:3000/api/user/auth/resetwithtoken', data);
  return response.data;
};

const useCreateNewPassword = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createNewPassword,
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      } else {
        console.log('NewPassword  successful!', data);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      } else {
        console.log('NewPassword failed!', error);
      }
    },
  });
};

export default useCreateNewPassword;
