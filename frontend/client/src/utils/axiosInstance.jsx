import axios from "axios";
import config from "../config/config";
import { refreshAccessToken } from "./authUtils";

const axiosInstance = axios.create({
  baseURL: config.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

if (localStorage.getItem("accessToken")) {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await refreshAccessToken();
        const newAccessToken = localStorage.getItem("accessToken");
        if (newAccessToken) {
          originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
        }
        return axiosInstance(originalRequest);
      }
      return Promise.reject(error);
    }
  );
}
export default axiosInstance;
