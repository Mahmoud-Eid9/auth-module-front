import axios, { AxiosError } from "axios";
import { getAuthToken } from "../utils/authTokenStore";
import { setAuthToken } from "../utils/authTokenStore";
import type { AxiosRequestConfig } from 'axios';

interface CsrfResponse {
  csrfToken: string;
}

const excludedRoutes = ['/auth/login', '/auth/register', '/auth/refresh'];

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  retry?: boolean;
}
console.log(import.meta.env.VITE_API_URL)
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // get from global state
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if(originalRequest == null){
      return Promise.reject(error);
    }
    if (originalRequest.url && excludedRoutes.includes(originalRequest.url)) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;

      try {
        const { data } = await apiClient.post('/auth/refresh');
        setAuthToken(data.accessToken);
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

