import axios from "axios";
import { API_BASE_URL } from "../config";

// Create main axios instance
const axiosInstance = axios.create({
  baseURL:API_BASE_URL,
  withCredentials: true, 
});

// Add access token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("refreshAccessToken")
    ) {
      if (isRefreshing) {
        // If a refresh is already happening, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
       
        const res = await axios.post(
          `${API_BASE_URL}/auth/refreshAccessToken`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.data.accessToken;
        console.log(" New Access Token:", newAccessToken);

        // Save and update localStorage
        localStorage.setItem("accessToken", newAccessToken);

        // Retry queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        originalRequest.headers["authorization"] =
          "Bearer " + newAccessToken;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        // optional redirect to login
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
