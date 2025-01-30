// src/hooks/useAxiosInstance.js
import { useMemo } from 'react';
import axios from 'axios';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

const useAxiosInstance = () => {
  const authHeader = useAuthHeader();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: 'http://localhost:3000/api',
    });

    instance.interceptors.request.use(
      (config) => {
        const token = authHeader;
        if (token) {
          config.headers.Authorization = token.split(' ')[1];
        } else {
          console.log('No token found');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return instance;
  }, [authHeader]);

  return api;
};

export default useAxiosInstance;
