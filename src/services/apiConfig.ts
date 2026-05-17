import axios from "axios";
import Cookies from "js-cookie";

// Khởi tạo Trạm hải quan (Axios Instance)
const api = axios.create({
  baseURL: "https://elearning-api-bc91.onrender.com/api", // Thay bằng URL API thực tế của CyberSoft
  timeout: 10000, // Đợi tối đa 10s, quá thời gian thì hủy
});

// -------------------------------------------------------------
// 1. REQUEST INTERCEPTOR (Kiểm tra hàng TRƯỚC KHI gửi đi)
// Xử lý lỗ hổng số 2: Móc túi Vòng tay VIP (Token)
// -------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    // Thò tay vào két sắt lấy Token
    const token = Cookies.get("accessToken");

    // Nếu có token và config.headers tồn tại (Kiểm tra an toàn của TypeScript)
    if (token && config.headers) {
      // Gắn tem VIP vào nắp thùng hàng
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// -------------------------------------------------------------
// 2. RESPONSE INTERCEPTOR (Kiểm tra hàng SAU KHI nhận về)
// Đã khắc phục: Lỗi vòng lặp reload ở trang Đăng Nhập
// -------------------------------------------------------------
api.interceptors.response.use(
  (response) => {
    // KHÔNG BÓC HỘP NỮA! Trả nguyên xe hàng về cho Service Layer xử lý
    return response;
  },
  (error) => {
    // Bắt lỗi 401
    if (error.response && error.response.status === 401) {
      // Lấy URL của request vừa bị lỗi
      const originalRequestUrl = error.config?.url;

      // KIỂM TRA LOGIC SINH TỬ: Có phải là đang gọi API Đăng nhập không?
      // (Dùng .includes để bắt chuỗi cho an toàn, đề phòng có dấu / ở đầu hoặc cuối)
      const isLoginRequest =
        originalRequestUrl &&
        originalRequestUrl.includes("/QuanLyNguoiDung/DangNhap");

      // NẾU KHÔNG PHẢI LÀ API ĐĂNG NHẬP, thì mới thực hiện đuổi khách
      if (!isLoginRequest) {
        // B1: Tiêu hủy Vòng tay VIP
        Cookies.remove("accessToken");

        // B2: Đá văng về trang đăng nhập
        if (typeof window !== "undefined") {
          window.location.href = "/dangnhap";
        }
      }
      // NẾU LÀ API ĐĂNG NHẬP: Bỏ qua khối lệnh trên, trôi tuột xuống Promise.reject
    }

    // Ném lỗi ra ngoài cho khối try-catch trong Component tự chụp lại và hiển thị UI
    return Promise.reject(error);
  },
);

export default api;
