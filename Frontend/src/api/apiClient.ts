import axios, {AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {AccessTokenResponse} from '../types/AccessTokenResponse.ts';

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');

  if (token)
    config.headers.Authorization = `Bearer ${token}`;

  return config;
};

export const ApiClient = axios.create({
  baseURL: import.meta.env.VITE_ROOT_URL,
  withCredentials: true,
});

ApiClient.interceptors.request.use(authRequestInterceptor);

const RoutesShouldNotRefresh = ['api/accounts/login'];

ApiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    const originalUrl = originalRequest.url;

    if (RoutesShouldNotRefresh.includes(originalUrl)) {
      return Promise.reject(error?.response?.data);
    }

    console.log('ERROR RESPONSE', error);

    if (error.response?.status === 401) {
      // Very important to return a promise, otherwise react-query get error before this interceptor finished
      return new Promise((resolve, reject) => {
        axios<never, AxiosResponse<AccessTokenResponse>>({
          method: 'POST',
          url: `${import.meta.env.VITE_ROOT_URL}api/accounts/refresh`,
          withCredentials: true,
          headers: {
            Accept: 'application/json',
          },
          data: {
            refreshToken: localStorage.getItem('refreshToken'),
          },
        })
          .then((response) => {

            // Making client SPA safe is out of scope for this project.
            // So, just throw these into local storage.

            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

            ApiClient(originalRequest)
              .then((response) => {
                resolve(response);
              })
              .catch((error) => {
                reject(error?.response?.data);
              });
          })
          .catch((error) => {
            reject(error?.response?.data);
          });
      });
    } else {
      return Promise.reject(error?.response?.data);
    }
  },
);