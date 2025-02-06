// src/hooks/usedeletedonor.js
import { useMutation } from '@tanstack/react-query';
import useAxiosInstance from '../utils/Api';



const usedeletedonor = ({ onSuccess, onError }) => {
    const api=useAxiosInstance()

  return useMutation({
    mutationFn: async (id) => {
        const response = await api.delete('/donor/manage/delete/'+id);
        return response.data},
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      } else {
        console.log('donor registration successful!', data);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      } else {
        console.log('donor registration failed!', error);
      }
    },
  });
};

export default usedeletedonor;
