import api from "./apiConfig";

// --- DATA TRANSFER OBJECTS (DTOs) & INTERFACES ---
export interface UserProfile {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
  maNhom: string;
  maLoaiNguoiDung: string;
  chiTietKhoaHocGhiDanh: any[];
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  content: T;
}

// --- USER MANAGEMENT SERVICES ---
export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.post<ApiResponse<UserProfile>>(
      "/QuanLyNguoiDung/ThongTinTaiKhoan",
    );

    const content = response?.data?.content;

    if (!content) {
      throw new Error(
        "Dữ liệu phản hồi từ máy chủ không đúng định dạng chuẩn!",
      );
    }

    return content;
  },

  updateProfile: async (data: any) => {
    try {
      const response = await api.put(
        "/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
        data,
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.content ||
        error.response?.data?.message ||
        "Lỗi cập nhật dữ liệu cá nhân"
      );
    }
  },

  // --- ADMIN OPERATIONS (Nghiệp vụ quản trị người dùng) ---

  getUserList: async () => {
    try {
      const response = await api.get(
        "/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01",
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.content || "Lỗi truy xuất danh sách người dùng"
      );
    }
  },

  // Lấy danh sách yêu cầu ghi danh đang chờ duyệt (Pending Enrollment)
  LayDanhSachKhoaHocChoXetDuyet: async (taiKhoan: string) => {
    try {
      const response = await api.post(
        "/QuanLyNguoiDung/LayDanhSachKhoaHocChoXetDuyet",
        { taiKhoan },
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.content || "Lỗi trích xuất danh sách chờ duyệt"
      );
    }
  },

  // Lấy danh sách khóa học đã duyệt hợp lệ (Approved Enrollment)
  LayDanhSachKhoaHocDaXetDuyet: async (taiKhoan: string) => {
    try {
      const response = await api.post(
        "/QuanLyNguoiDung/LayDanhSachKhoaHocDaXetDuyet",
        { taiKhoan },
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.content || "Lỗi trích xuất danh sách hợp lệ";
    }
  },

  layThongTinTaiKhoan: async () => {
    try {
      const response = await api.post("/QuanLyNguoiDung/ThongTinTaiKhoan");
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.content || "Lỗi truy xuất thông tin tài khoản"
      );
    }
  },

  addUser: async (data: any) => {
    try {
      const response = await api.post("/QuanLyNguoiDung/ThemNguoiDung", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.content || "Lỗi khởi tạo người dùng mới";
    }
  },

  updateUserAdmin: async (data: any) => {
    try {
      const response = await api.put(
        "/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
        data,
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.content || "Lỗi cập nhật hồ sơ người dùng";
    }
  },

  deleteUser: async (taiKhoan: string) => {
    try {
      const response = await api.delete(
        `/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`,
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.content || "Lỗi thực thi xóa tài khoản";
    }
  },
};
