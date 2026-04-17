import axios from 'axios';

const api = axios.create({
  baseURL: 'https://elearning-api-bc91.onrender.com/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  // Tạm thời để trống, khi nào làm tới Đăng Nhập thầy sẽ chỉ em thêm Token vào đây
  return config;
});

export default api;