import api from "./apiConfig";

// Hàm lấy danh sách danh mục (API số 2 trong Swagger)
export const courseService = {
  getCategoryList: async () => {
    try {
      // Dùng axios gọi tới đường dẫn API tương ứng
      const response = await api.get("/QuanLyKhoaHoc/LayDanhMucKhoaHoc");
      return response.data;
    } catch (error) {
      console.log("Lỗi lấy danh mục:", error);
    }
  },

  getCourseList: async () => {
    try {
      // Đường dẫn này dựa theo Swagger của em
      const response = await api.get("/QuanLyKhoaHoc/LayDanhSachKhoaHoc");
      return response.data;
    } catch (error) {
      console.log("Lỗi lấy khóa học:", error);
    }
  },

  getCourseDetail: async (maKhoaHoc: string) => {
    try {
      // Gọi API số 1.1 theo đặc tả của giảng viên
      const response = await api.get(
        `/QuanLyKhoaHoc/LayThongTinKhoaHoc?maKhoaHoc=${maKhoaHoc}`,
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi lấy chi tiết khóa học:", error);
    }
  },

  // Lấy danh sách khóa học theo mã danh mục (Ví dụ: FE, BE, Mobile...)
  getCoursesByCategory: async (maDanhMuc: string) => {
    try {
      // Gọi API yêu cầu backend lọc khóa học
      // Lưu ý: Tùy vào thiết kế của Swagger nhà em, url có thể thêm params MaNhom, em nhớ kiểm tra nhé.
      const response = await api.get(
        `/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${maDanhMuc}&MaNhom=GP01`,
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi lấy khóa học theo danh mục:", error);
    }
  },

  // Tìm kiếm khóa học theo tên
  searchCourse: async (tuKhoa: string) => {
    try {
      // API của CyberSoft thường là LayDanhSachKhoaHoc kết hợp tham số tenKhoaHoc
      const response = await api.get(
        `/QuanLyKhoaHoc/LayDanhSachKhoaHoc?tenKhoaHoc=${tuKhoa}&MaNhom=GP01`,
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi tìm kiếm khóa học:", error);
    }
  },

  // Ghi danh khóa học (Học viên tự đăng ký)
  ghiDanhKhoaHoc: async (data: { maKhoaHoc: string; taiKhoan: string }) => {
    try {
      const response = await api.post("/QuanLyKhoaHoc/GhiDanhKhoaHoc", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.content || error.response?.data || "Lỗi ghi danh khóa học";
    }
  },

  // Đăng ký khóa học (Dành cho Học viên tự đăng ký trên web)
  dangKyKhoaHoc: async (data: { maKhoaHoc: string; taiKhoan: string }) => {
    try {
      const response = await api.post("/QuanLyKhoaHoc/DangKyKhoaHoc", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.content || error.response?.data || "Lỗi đăng ký khóa học";
    }
  },

  // Hủy ghi danh khóa học
  huyGhiDanh: async (data: { maKhoaHoc: string; taiKhoan: string }) => {
    try {
      const response = await api.post("/QuanLyKhoaHoc/HuyGhiDanh", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.content || error.response?.data || "Lỗi hủy ghi danh";
    }
  },

  // 1. Thêm khóa học mới
  addCourse: async (data: any) => {
    try {
      const response = await api.post("/QuanLyKhoaHoc/ThemKhoaHoc", data);
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.content ||
        error.response?.data ||
        "Lỗi thêm khóa học"
      );
    }
  },

  // 2. Cập nhật khóa học
  updateCourse: async (data: any) => {
    try {
      const response = await api.put("/QuanLyKhoaHoc/CapNhatKhoaHoc", data);
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.content ||
        error.response?.data ||
        "Lỗi cập nhật khóa học"
      );
    }
  },

  // 3. Xóa khóa học
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
        "Lỗi xóa khóa học"
      );
    }
  },
};
