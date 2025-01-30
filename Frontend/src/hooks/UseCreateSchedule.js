// src/hooks/usecreateschedule.js
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useAxiosInstance from "../utils/Api";


const usecreateschedule = ({ onSuccess, onError }) => {

const api=useAxiosInstance()

    const createschedule = async (data) => {
    
        const response = await api.post('/schedule/manage/create', data);
        return response.data;
      };
      
  return useMutation({
    mutationFn: createschedule,
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

export default usecreateschedule;
