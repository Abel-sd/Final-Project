// src/hooks/useupdateDonor.js
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useAxiosInstance from "../utils/Api";


const useupdateDonor = ({ onSuccess, onError }) => {

const api=useAxiosInstance()

    const updateDonor = async (data) => {
    
        const response = await api.put('/donor/manage/update', data);
        return response.data;
      };
      
  return useMutation({
mutationKey:["updateDonor"],
    mutationFn: updateDonor,
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

export default useupdateDonor;
