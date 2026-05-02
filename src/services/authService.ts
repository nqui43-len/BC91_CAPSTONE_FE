import api from './apiConfig'; // Tái sử dụng trục API em đã có

export const authService = {
  // Hàm gọi anh Bảo vệ
  login: async (taiKhoan: string, matKhau: string) => {
    try {
      // Gọi lên Backend kiểm tra
      const response = await api.post('/QuanLyNguoiDung/DangNhap', {
        taiKhoan,
        matKhau
      });
      return response.data; 
    } catch (error) {
      console.log('Lỗi đăng nhập:', error);
      throw error; // Ném lỗi ra ngoài để lát nữa bên giao diện chụp lại báo cho người dùng
    }
  }
};