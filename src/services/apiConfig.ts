import axios from "axios";
import Cookies from "js-cookie";

// --- AXIOS INSTANCE CONFIGURATION ---
const api = axios.create({
  baseURL: "https://elearning-api-bc91.onrender.com/api",
  timeout: 10000, 
});

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const originalRequestUrl = error.config?.url;

      const isLoginRequest =
        originalRequestUrl &&
        originalRequestUrl.includes("/QuanLyNguoiDung/DangNhap");

      if (!isLoginRequest) {
        Cookies.remove("accessToken");
        if (typeof window !== "undefined") {
          window.location.href = "/dangnhap";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
