// src/hooks/usedeletehospital.js
import { useMutation } from '@tanstack/react-query';

import useAxiosInstance from '../utils/Api';

const usedeletehospital = ({ onSuccess, onError }) => {
    const api=useAxiosInstance()
  return useMutation({
    mutationFn: async (id) => {
        const response = await api.delete('/hospital/manage/delete/'+ id);
        return response.data;
      },
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      } else {
        console.log('Hospital registration successful!', data);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      } else {
        console.log('Hospital registration failed!', error);
      }
    },
  });
};

export default usedeletehospital;
