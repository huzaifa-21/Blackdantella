import axios from "axios";
import config from "../config/config";
import { toast } from "react-toastify";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${config.BASE_URL}/api/users/refresh`,
      {},
      { withCredentials: true }
    );

    if (response.data.success) {
      const newAccessToken = response.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      toast.success("Access token refreshed successfully.");
      return newAccessToken;
    } else {
      toast.error("Failed to refresh access token: " + response.data.message);
      throw new Error("Failed to refresh access token");
    }
  } catch (error) {
    toast.error("Error: " + error.message);
    throw error;
  }
};

// Axios interceptor to refresh token automatically
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshAccessToken()
          .then((newAccessToken) => {
            originalRequest.headers[
              "authorization"
            ] = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            resolve(axios(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default axios;
