// src/hooks/useCreateHospital.js
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const createHospital = async (hospitalData) => {
  const response = await axios.post('http://localhost:3000/api/hospital/manage/create', hospitalData);
  return response.data;
};

const useCreateHospital = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createHospital,
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

export default useCreateHospital;
