import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* REQUEST INTERCEPTOR */
api.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");

  if (access && !config.url.includes("users/refresh/")) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
});

/* RESPONSE INTERCEPTOR */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url.includes("login") ||
      originalRequest.url.includes("logout") ||
      originalRequest.url.includes("refresh") ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        const res = await api.post("users/refresh/");

        const newAccess = res.data.access;

        localStorage.setItem("access", newAccess);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccess}`,
        };

        return api(originalRequest);

      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("currentUser");

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;