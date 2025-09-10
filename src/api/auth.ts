import { apiClient } from "./axiosClient"
import { setAuthToken } from "../utils/authTokenStore";
interface LoginResponse {
  accessToken: string;
}

export const login = async (email: string, password: string) => {
    const res = await apiClient.post<LoginResponse>("/auth/login", { email, password });
    return res.data;
}

export const register = async(email: string, name: string, password: string) => {
 await apiClient.post("/auth/register", {email, name, password});
}


export const refresh = async () => {
  return await apiClient.get("/auth/refresh");
}

export const callHome = async() => {
  return await apiClient.get("/");
}

export const logout = async() => {
  const res = await apiClient.get("/auth/logout");
  setAuthToken(null);
  return res;
}