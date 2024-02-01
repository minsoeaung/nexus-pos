import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const ApiClient = axios.create({
  baseURL: import.meta.env.VITE_ROOT_URL,
});

ApiClient.interceptors.request.use(authRequestInterceptor);

type Token = {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

ApiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log("ERROR", error?.response?.data);
    if (error.response.status === 401) {
      // Very important to return a promise, otherwise react-query get error before this interceptor finished
      return new Promise((resolve, reject) => {
        axios<never, AxiosResponse<Token>>({
          method: 'GET',
          url: `${import.meta.env.VITE_ROOT_URL}refresh`,
          headers: {
            Accept: 'application/json',
          },
        })
          .then((response) => {
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