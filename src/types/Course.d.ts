// Khuôn đúc cho một Khóa Học
export interface Course {
  maKhoaHoc: string;
  tenKhoaHoc: string;
  hinhAnh: string;
  moTa: string;
  luotXem: number;
  nguoiTao: {
    taiKhoan: string;
    hoTen: string;
  };
}

// Khuôn đúc cho Danh Mục
export interface Category {
  maDanhMuc: string;
  tenDanhMuc: string;
}