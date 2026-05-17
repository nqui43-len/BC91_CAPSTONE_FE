"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/src/redux/store";
import { fetchProfile } from "@/src/redux/userSlice";
import Cookies from "js-cookie";

export default function ProfilePage() {
  // 1. Lấy thông tin từ Ngân hàng (Redux)
  const { userInfo, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  );
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // 2. CHỐT BẢO VỆ: Kích hoạt ngay khi vị khách bước vào phòng
  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (!token) {
      router.push("/dangnhap");
    } else {
      if (!userInfo) {
        dispatch(fetchProfile());
      }
    }
  }, [router, dispatch, userInfo]);

  // 3. Tránh hiện giao diện "nháy" lên 1 giây trước khi xác thực
  if (!isLoggedIn) {
    return null;
  }

  // 4. KIỂM TRA PHÂN QUYỀN: Có phải tài khoản Giáo vụ/Admin không?
  // (CyberSoft quy định: "GV" là Giáo vụ, "HV" là Học viên)
  const isAdmin = userInfo?.maLoaiNguoiDung === "GV";

  return (
    <main
      className="bg-light"
      style={{ minHeight: "80vh", paddingTop: "100px" }}
    >
      <div className="container py-5">
        <h2 className="fw-bold mb-4 border-start border-warning border-4 ps-3">
          Thông tin cá nhân
        </h2>
        <div className="row">
          {/* ---------------------------------------------------
              CỘT TRÁI: THẺ CĂN CƯỚC
              --------------------------------------------------- */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm border-0 rounded-4 text-center p-4 h-100">
              <div
                className="rounded-circle bg-warning text-dark mx-auto d-flex justify-content-center align-items-center fw-bold mb-3 shadow"
                style={{ width: "100px", height: "100px", fontSize: "2.5rem" }}
              >
                {userInfo?.taiKhoan
                  ? userInfo.taiKhoan.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <h4 className="fw-bold text-dark">{userInfo?.taiKhoan}</h4>
              <p className="text-sm bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 d-inline-block px-3 py-1 rounded-pill fw-bold mb-4 small">
                {isAdmin ? "🚀 Giáo Vụ Tối Cao" : "🎓 Học Viên"}
              </p>

              <button className="btn btn-outline-warning fw-bold w-100 rounded-pill">
                <i className="fa-solid fa-pen-to-square me-2"></i>
                Cập nhật hồ sơ
              </button>
            </div>
          </div>

          {/* ---------------------------------------------------
              CỘT PHẢI: CHI TIẾT & TÀI SẢN (PHÂN QUYỀN UI TẠI ĐÂY)
              --------------------------------------------------- */}
          <div className="col-md-8">
            <div className="card shadow-sm border-0 rounded-4 p-4 h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2">
                Thông tin liên hệ
              </h5>

              <div className="row mb-4">
                <div className="col-sm-6 mb-3">
                  <p className="text-muted mb-1 small">Email</p>
                  <strong className="text-dark">
                    {userInfo?.email || "Chưa cập nhật"}
                  </strong>
                </div>
                <div className="col-sm-6 mb-3">
                  <p className="text-muted mb-1 small">Số điện thoại</p>
                  <strong className="text-dark">
                    {userInfo?.soDT || "Chưa cập nhật"}
                  </strong>
                </div>
                <div className="col-sm-6 mb-3">
                  <p className="text-muted mb-1 small">Mã nhóm</p>
                  <strong className="text-dark">
                    {userInfo?.maNhom || "Chưa cập nhật"}
                  </strong>
                </div>
              </div>

              {/* ---------------------------------------------------
                  NẾU LÀ ADMIN/GIÁO VỤ: HIỂN THỊ BẢNG ĐIỀU KHIỂN QUẢN TRỊ
                  --------------------------------------------------- */}
              {isAdmin ? (
                <>
                  <h5 className="fw-bold mb-3 border-bottom pb-2 mt-4 text-primary">
                    <i className="fa-solid fa-toolbox me-2"></i> Bảng điều khiển
                    Giáo vụ
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="card h-100 border border-primary border-opacity-25 text-start shadow-sm rounded-3 bg-white">
                        <div className="card-body d-flex flex-column">
                          <h6 className="fw-bold text-dark mb-2">
                            <i className="fa-solid fa-book-open text-primary me-2"></i>
                            Quản lý Khóa học
                          </h6>
                          <p className="text-muted small mb-3">
                            Quyền hạn: Thêm khóa học mới, chỉnh sửa nội dung,
                            xóa khóa học hoặc phê duyệt học viên đăng ký.
                          </p>
                          <div className="mt-auto">
                            <button
                              onClick={() =>
                                alert(
                                  "Hệ thống: Chuyển hướng sang trang quản trị khóa học...",
                                )
                              }
                              className="btn btn-primary btn-sm fw-bold w-100 rounded-2"
                            >
                              Truy cập hệ thống{" "}
                              <i className="fa-solid fa-arrow-right ms-1"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card h-100 border border-success border-opacity-25 text-start shadow-sm rounded-3 bg-white">
                        <div className="card-body d-flex flex-column">
                          <h6 className="fw-bold text-dark mb-2">
                            <i className="fa-solid fa-users text-success me-2"></i>
                            Quản lý Người dùng
                          </h6>
                          <p className="text-muted small mb-3">
                            Quyền hạn: Quản lý danh sách học viên, phân quyền
                            tài khoản, cấp khóa học và xử lý khiếu nại.
                          </p>
                          <div className="mt-auto">
                            <button
                              onClick={() =>
                                alert(
                                  "Hệ thống: Chuyển hướng sang trang quản trị người dùng...",
                                )
                              }
                              className="btn btn-success btn-sm fw-bold w-100 rounded-2"
                            >
                              Truy cập hệ thống{" "}
                              <i className="fa-solid fa-arrow-right ms-1"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* ---------------------------------------------------
                    NẾU LÀ HỌC VIÊN: HIỂN THỊ DANH SÁCH KHÓA HỌC ĐÃ MUA
                    --------------------------------------------------- */
                <>
                  <h5 className="fw-bold mb-3 border-bottom pb-2 mt-4">
                    Khóa học của tôi
                  </h5>
                  <div className="row g-3">
                    {userInfo?.chiTietKhoaHocGhiDanh &&
                    userInfo.chiTietKhoaHocGhiDanh.length > 0 ? (
                      userInfo.chiTietKhoaHocGhiDanh.map(
                        (khoaHoc: any, index: number) => (
                          <div className="col-md-6" key={index}>
                            <div className="card h-100 border text-start shadow-sm rounded-3">
                              <div className="card-body d-flex flex-column">
                                <h6 className="fw-bold text-dark mb-2">
                                  {khoaHoc.tenKhoaHoc}
                                </h6>
                                <p className="text-muted small mb-3">
                                  Mã KH: {khoaHoc.maKhoaHoc}
                                </p>
                                <div className="mt-auto">
                                  <span className="badge bg-success bg-opacity-10 text-success border border-success">
                                    <i className="fa-solid fa-check-circle me-1"></i>{" "}
                                    Đã ghi danh
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )
                    ) : (
                      <div className="col-12">
                        <div className="alert alert-warning rounded-3 border-0">
                          <i className="fa-solid fa-face-frown me-2"></i>
                          Bạn chưa đăng ký khóa học nào! Hãy ra trang chủ và
                          chọn cho mình một khóa học nhé.
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
