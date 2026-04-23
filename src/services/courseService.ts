import api from './apiConfig';

// Hàm lấy danh sách danh mục (API số 2 trong Swagger)
export const courseService = {
  getCategoryList: async () => {
    try {
      // Dùng axios gọi tới đường dẫn API tương ứng
      const response = await api.get('/QuanLyKhoaHoc/LayDanhMucKhoaHoc');
      return response.data; 
    } catch (error) {
      console.log('Lỗi lấy danh mục:', error);
    }
  },
  getCourseList: async () => {
    try {
      // Đường dẫn này dựa theo Swagger của em
      const response = await api.get('/QuanLyKhoaHoc/LayDanhSachKhoaHoc');
      return response.data;
    } catch (error) {
      console.log('Lỗi lấy khóa học:', error);
    }
  },
  getCourseDetail: async (maKhoaHoc: string) => {
    try {
      // Gọi API số 1.1 theo đặc tả của giảng viên
      const response = await api.get(`/QuanLyKhoaHoc/LayThongTinKhoaHoc?maKhoaHoc=${maKhoaHoc}`);
      return response.data;
    } catch (error) {
      console.log('Lỗi lấy chi tiết khóa học:', error);
    }
  },
};