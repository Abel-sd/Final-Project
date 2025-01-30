// src/hooks/usebloodrequest.js
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useAxiosInstance from "../utils/Api";


const usebloodrequest = ({ onSuccess, onError }) => {

const api=useAxiosInstance()

    const bloodrequest = async (data) => {
    
        const response = await api.post('/bloodrequest/manage/create', data);
        return response.data;
      };
      
  return useMutation({
    mutationKey:["bloodrequest"],
    mutationFn: bloodrequest,
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

export default usebloodrequest;
