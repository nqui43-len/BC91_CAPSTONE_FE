import api from "./apiConfig";

// 1. ĐỊNH NGHĨA "HỢP ĐỒNG DỮ LIỆU" (Thường cái này nằm trong folder src/types)
export interface UserProfile {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
  maNhom: string;
  maLoaiNguoiDung: string;
  chiTietKhoaHocGhiDanh: any[]; // Tạm thời để any[], sau này có thể định nghĩa chi tiết hơn nếu cần
}

// (Tùy chọn) Nếu Backend CyberSoft có bọc một lớp bên ngoài, ta tạo một Generic Type
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  content: T; // Dữ liệu thật sự nằm ở đây
}

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.post<ApiResponse<UserProfile>>(
      "/QuanLyNguoiDung/ThongTinTaiKhoan",
    );

    // BẢO VỆ 2 LỚP: Bóc hộp an toàn bằng Optional Chaining
    const content = response?.data?.content;

    if (!content) {
      // Chủ động ném lỗi nếu Backend trả thiếu data (Redux Async Thunk sẽ catch cái này)
      throw new Error("Dữ liệu từ máy chủ không đúng định dạng!");
    }

    return content; // Lúc này TypeScript chắc chắn 100% đây là UserProfile
  },

  // Gọi API Cập nhật thông tin người dùng
  updateProfile: async (data: any) => {
    try {
      const response = await api.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", data);
      return response.data;
    } catch (error: any) {
      // Quăng lỗi ra để ngoài giao diện bắt được và báo Alert
      throw error.response?.data?.content || error.response?.data?.message || "Lỗi cập nhật";
    }
  },

  // Lấy danh sách toàn bộ người dùng (Dành cho Admin)
  getUserList: async () => {
    try {
      // Nhớ truyền đúng MaNhom GP01 (hoặc mã nhóm em đang dùng)
      const response = await api.get("/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01");
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.content || "Lỗi lấy danh sách người dùng";
    }
  },

  // Lấy danh sách khóa học học viên đã bấm đăng ký nhưng CHƯA ĐƯỢC DUYỆT
  LayDanhSachKhoaHocChoXetDuyet: async (taiKhoan: string) => {
    try {
      const response = await api.post("/QuanLyNguoiDung/LayDanhSachKhoaHocChoXetDuyet", { taiKhoan });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.content || "Lỗi lấy danh sách chờ duyệt";
    }
  },

  // Lấy danh sách khóa học học viên ĐÃ ĐƯỢC DUYỆT
  LayDanhSachKhoaHocDaXetDuyet: async (taiKhoan: string) => {
    try {
      const response = await api.post("/QuanLyNguoiDung/LayDanhSachKhoaHocDaXetDuyet", { taiKhoan });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.content || "Lỗi lấy danh sách đã duyệt";
    }
  },

  // Học viên tự lấy lại toàn bộ thông tin (Bao gồm khóa học đã duyệt)
  layThongTinTaiKhoan: async () => {
    try {
      const response = await api.post("/QuanLyNguoiDung/ThongTinTaiKhoan");
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.content || "Lỗi lấy thông tin tài khoản";
    }
  },
  
  // 1. Thêm người dùng mới
  addUser: async (data: any) => {
    try {
      const response = await api.post("/QuanLyNguoiDung/ThemNguoiDung", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.content || "Lỗi thêm người dùng";
    }
  },

  // 2. Cập nhật thông tin người dùng (từ trang Admin)
  updateUserAdmin: async (data: any) => {
    try {
      const response = await api.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.content || "Lỗi cập nhật người dùng";
    }
  },

  // 3. Xóa người dùng
  deleteUser: async (taiKhoan: string) => {
    try {
      const response = await api.delete(`/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.content || "Lỗi xóa người dùng";
    }
  },
};
