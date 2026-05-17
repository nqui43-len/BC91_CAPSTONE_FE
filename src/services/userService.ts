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
};
