import axios, { AxiosError } from "axios";
import { getAuthToken } from "../utils/authTokenStore";
import { setAuthToken } from "../utils/authTokenStore";
import type { AxiosRequestConfig } from 'axios';


const excludedRoutes = ['/auth/login', '/auth/register', '/auth/refresh'];

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to requeusts
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

//refresh token when met with unauthorized response
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const userRequest = error.config as CustomAxiosRequestConfig;
    if(userRequest == null){
      return Promise.reject(error);
    }
    if (userRequest.url && excludedRoutes.includes(userRequest.url)) {
      return Promise.reject(error);
    }
    //stops you from refreshing when met with error while refreshing
    // (refresh -> error -> refresh -> error) this if breaks the loop
    if (error.response?.status === 401 && !userRequest.retry) {
      userRequest.retry = true;

      try {
        const { data } = await apiClient.post('/auth/refresh');
        setAuthToken(data.accessToken);
        if (userRequest.headers) {
          userRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        }
        //replay users request
        return apiClient(userRequest);
      } catch (err) {
        window.location.href = '/login';
        return Promise.reject("Carefull there, You are not authorized");
      }
    }

    return Promise.reject(error);
  }
);

