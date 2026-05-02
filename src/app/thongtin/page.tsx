"use client";

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/src/redux/store'; // Nhớ check lại đường dẫn file store

export default function ProfilePage() {
  // 1. Lấy thông tin từ Ngân hàng (Redux)
  const { userInfo, isLoggedIn } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  // 2. CHỐT BẢO VỆ: Kích hoạt ngay khi vị khách bước vào phòng
  useEffect(() => {
    // -------------------------------------------------------------
    // BÀI TẬP CỦA EM: Viết logic bảo vệ
    // Nếu khách CHƯA đăng nhập (dựa vào biến isLoggedIn), 
    // hãy bảo người lái xe (router) chở họ thẳng về trang '/dangnhap'
    if (!isLoggedIn) {
      router.push('/dangnhap'); // Đưa khách về trang đăng nhập
    }
    // -------------------------------------------------------------
    
  }, [isLoggedIn, router]); // Theo dõi sự thay đổi của 2 biến này

  // 3. Tránh hiện giao diện "nháy" lên 1 giây trước khi bị đuổi ra ngoài
  if (!isLoggedIn) {
    return null; // Tạm thời nhắm mắt lại, không vẽ gì cả
  }

  // 4. Nếu đã vượt qua chốt bảo vệ, cho phép xem phòng VIP
  return (
    <main className="bg-light" style={{ minHeight: '80vh', paddingTop: '100px' }}>
      <div className="container py-5">
        <h2 className="fw-bold mb-4 border-start border-warning border-4 ps-3">
          Thông tin cá nhân
        </h2>
        {/* BẮT ĐẦU BỐ CỤC 2 CỘT */}
        <div className="row">
          
          {/* ---------------------------------------------------
              CỘT TRÁI (col-md-4): THẺ CĂN CƯỚC
              --------------------------------------------------- */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm border-0 rounded-4 text-center p-4 h-100">
              {/* Thầy tặng em cái khối Avatar to bự */}
              <div 
                className="rounded-circle bg-warning text-dark mx-auto d-flex justify-content-center align-items-center fw-bold mb-3 shadow"
                style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}
              >
                {/* BÀI TẬP: Tái sử dụng logic lấy chữ cái đầu tiên của em vào đây */}
                {userInfo?.taiKhoan ? userInfo.taiKhoan.charAt(0).toUpperCase() : 'U'}
              </div>
              
              {/* BÀI TẬP: Hiển thị Tài khoản và Họ tên */}
              <h4 className="fw-bold text-dark">{userInfo?.taiKhoan}</h4>
              <p className="text-muted mb-4">{userInfo?.hoTen || 'Chưa cập nhật'}</p>
              
              <button className="btn btn-outline-warning fw-bold w-100 rounded-pill">
                <i className="fa-solid fa-pen-to-square me-2"></i>
                Cập nhật hồ sơ
              </button>
            </div>
          </div>

          {/* ---------------------------------------------------
              CỘT PHẢI (col-md-8): CHI TIẾT & TÀI SẢN
              --------------------------------------------------- */}
          <div className="col-md-8">
            <div className="card shadow-sm border-0 rounded-4 p-4 h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Thông tin liên hệ</h5>
              
              <div className="row mb-4">
                <div className="col-sm-6 mb-3">
                  <p className="text-muted mb-1 small">Email</p>
                  {/* BÀI TẬP: Hiển thị Email */}
                  <strong className="text-dark">{userInfo?.email || 'Chưa cập nhật'}</strong>
                </div>
                <div className="col-sm-6 mb-3">
                  <p className="text-muted mb-1 small">Số điện thoại</p>
                  {/* BÀI TẬP: Hiển thị Số điện thoại */}
                  <strong className="text-dark">{userInfo?.soDT || 'Chưa cập nhật'}</strong>
                </div>
                <div className="col-sm-6 mb-3">
                  <p className="text-muted mb-1 small">Mã nhóm</p>
                  <strong className="text-dark">{userInfo?.maNhom || 'Chưa cập nhật'}</strong>
                </div>
              </div>

              <h5 className="fw-bold mb-3 border-bottom pb-2 mt-4">Khóa học của tôi</h5>
              <div className="alert alert-info rounded-3">
                <i className="fa-solid fa-clock-rotate-left me-2"></i>
                Khu vực này chúng ta sẽ gọi anh bồi bàn (API) để lấy danh sách khóa học ở bước sau nhé!
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}