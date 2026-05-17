import api from "./apiConfig";

// --- COURSE MANAGEMENT SERVICES ---
export const courseService = {
  // --- 1. DATA FETCHING (Truy xuất dữ liệu công khai) ---

  getCategoryList: async () => {
    try {
      const response = await api.get("/QuanLyKhoaHoc/LayDanhMucKhoaHoc");
      return response.data;
    } catch (error) {
      console.error("Lỗi truy xuất danh mục hệ thống:", error);
    }
  },

  getCourseList: async () => {
    try {
      const response = await api.get("/QuanLyKhoaHoc/LayDanhSachKhoaHoc");
      return response.data;
    } catch (error) {
      console.error("Lỗi truy xuất danh sách khóa học:", error);
    }
  },

  getCourseDetail: async (maKhoaHoc: string) => {
    try {
      const response = await api.get(
        `/QuanLyKhoaHoc/LayThongTinKhoaHoc?maKhoaHoc=${maKhoaHoc}`,
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi truy xuất chi tiết khóa học:", error);
    }
  },

  getCoursesByCategory: async (maDanhMuc: string) => {
    try {
      const response = await api.get(
        `/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${maDanhMuc}&MaNhom=GP01`,
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi lọc khóa học theo phân loại danh mục:", error);
    }
  },

  searchCourse: async (tuKhoa: string) => {
    try {
      const response = await api.get(
        `/QuanLyKhoaHoc/LayDanhSachKhoaHoc?tenKhoaHoc=${tuKhoa}&MaNhom=GP01`,
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi thực thi truy vấn tìm kiếm khóa học:", error);
    }
  },

  // --- 2. ENROLLMENT WORKFLOW (Quy trình ghi danh) ---

  ghiDanhKhoaHoc: async (data: { maKhoaHoc: string; taiKhoan: string }) => {
    try {
      const response = await api.post("/QuanLyKhoaHoc/GhiDanhKhoaHoc", data);
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.content ||
        error.response?.data ||
        "Lỗi ghi danh khóa học"
      );
    }
  },

  dangKyKhoaHoc: async (data: { maKhoaHoc: string; taiKhoan: string }) => {
    try {
      const response = await api.post("/QuanLyKhoaHoc/DangKyKhoaHoc", data);
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.content ||
        error.response?.data ||
        "Lỗi đăng ký khóa học"
      );
    }
  },

  huyGhiDanh: async (data: { maKhoaHoc: string; taiKhoan: string }) => {
    try {
      const response = await api.post("/QuanLyKhoaHoc/HuyGhiDanh", data);
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.content ||
        error.response?.data ||
        "Lỗi hủy ghi danh"
      );
    }
  },

  // --- 3. ADMIN: DATA MUTATION (Thao tác quản trị hệ thống cấp cao) ---

  addCourse: async (data: any) => {
    try {
      const response = await api.post("/QuanLyKhoaHoc/ThemKhoaHoc", data);
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.content ||
        error.response?.data ||
        "Lỗi thao tác thêm khóa học"
      );
    }
  },

  updateCourse: async (data: any) => {
    try {
      const response = await api.put("/QuanLyKhoaHoc/CapNhatKhoaHoc", data);
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.content ||
        error.response?.data ||
        "Lỗi cập nhật cấu trúc khóa học"
      );
    }
  },

  deleteCourse: async (maKhoaHoc: string) => {
    try {
      const response = await api.delete(
        `/QuanLyKhoaHoc/XoaKhoaHoc?MaKhoaHoc=${maKhoaHoc}`,
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.content ||
        error.response?.data ||
        "Lỗi thực thi xóa khóa học"
      );
    }
  },
};
