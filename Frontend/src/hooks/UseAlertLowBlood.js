// src/hooks/useAlertlowBlood.js
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useAxiosInstance from "../utils/Api";


const useAlertlowBlood = ({ onSuccess, onError }) => {

const api=useAxiosInstance()

    const AlertlowBlood = async (data) => {
    
        const response = await api.post('/inventory/manage/alert-low-inventory', data);
        return response.data;
      };
      
  return useMutation({
    mutationKey:["AlertlowBlood"],
    mutationFn: AlertlowBlood,
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

export default useAlertlowBlood;
