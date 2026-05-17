import api from "./apiConfig";

// --- AUTHENTICATION SERVICES ---
export const authService = {
  login: async (taiKhoan: string, matKhau: string) => {
    try {
      const response = await api.post("/QuanLyNguoiDung/DangNhap", {
        taiKhoan,
        matKhau,
      });
      return response.data;
    } catch (error) {
      console.error("Authentication Error:", error);
      throw error;
    }
  },
};
