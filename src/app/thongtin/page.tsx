"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/src/redux/store";
import { fetchProfile } from "@/src/redux/userSlice";
import { userService } from "@/src/services/userService";
import Cookies from "js-cookie";

export default function ProfilePage() {
  const { userInfo, isLoggedIn, loading } = useSelector(
    (state: RootState) => state.user,
  );
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [editData, setEditData] = useState({
    hoTen: "",
    soDT: "",
    email: "",
    matKhau: "",
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Kiểm tra trạng thái xác thực và phiên làm việc toàn cục (Session Validation)
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/dangnhap");
    } else {
      // Trường hợp đã có Token ở Cookie nhưng Redux State chưa kịp khởi tạo thông tin
      if (!userInfo) {
        dispatch(fetchProfile());
      }
    }
  }, [router, dispatch, userInfo]);

  // Đồng bộ hóa thủ công (Manual Re-validation) nhằm làm tươi dữ liệu tức thời từ database gốc
  const handleSyncData = async () => {
    setIsSyncing(true);
    await dispatch(fetchProfile());
    // Tạo hiệu ứng trễ nhân tạo (Artificial UX Delay) tối ưu hóa trải nghiệm thị giác người dùng
    setTimeout(() => setIsSyncing(false), 800);
  };

  // Đổ dữ liệu tài khoản hiện có vào biểu mẫu chỉnh sửa hồ sơ cá nhân
  const handleOpenModal = () => {
    if (userInfo) {
      setEditData({
        hoTen: userInfo.hoTen || "",
        soDT: userInfo.soDT || "",
        email: userInfo.email || "",
        matKhau: "",
      });
    }
  };

  // Tiếp nhận và xử lý luồng cập nhật thông tin cá nhân của người dùng
  const handleSubmitUpdate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        taiKhoan: userInfo?.taiKhoan,
        matKhau: editData.matKhau,
        hoTen: editData.hoTen,
        soDT: editData.soDT,
        maLoaiNguoiDung: userInfo?.maLoaiNguoiDung,
        maNhom: userInfo?.maNhom,
        email: editData.email,
      };
      await userService.updateProfile(payload);
      alert("🎉 Cập nhật hồ sơ thành công!");

      dispatch(fetchProfile());
    } catch (error: any) {
      alert("❌ Cập nhật thất bại: " + error);
    }
  };

  if (!isLoggedIn) return null;

  // Thiết lập ma trận phân quyền hệ thống dựa trên vai trò tài khoản (Role-Based Access Control - RBAC)
  const isLevel1 = userInfo?.taiKhoan === "admin_gv";
  const isLevel2 =
    userInfo?.maLoaiNguoiDung === "GV" && userInfo?.taiKhoan !== "admin_gv";
  const isLevel3 = userInfo?.maLoaiNguoiDung === "HV";
  const myCourses = userInfo?.chiTietKhoaHocGhiDanh || [];

  return (
    <main
      className="bg-light"
      style={{ minHeight: "80vh", paddingTop: "100px" }}
    >
      <div className="container py-5">
        <h2 className="fw-bold mb-4 border-start border-warning border-4 ps-3 text-start">
          Thông tin cá nhân
        </h2>
        <div className="row">
          {/* Cấu trúc thẻ hiển thị tổng quan tài khoản và các hành động cốt lõi */}
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

              {isLevel1 && (
                <p className="text-sm bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 d-inline-block px-3 py-1 rounded-pill fw-bold mb-4 small">
                  🚀 Giáo Vụ Tối Cao (Cấp 1)
                </p>
              )}
              {isLevel2 && (
                <p className="text-sm bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 d-inline-block px-3 py-1 rounded-pill fw-bold mb-4 small">
                  💼 Giáo Vụ Vận Hành (Cấp 2)
                </p>
              )}
              {isLevel3 && (
                <p className="text-sm bg-success bg-opacity-10 text-success border border-success border-opacity-25 d-inline-block px-3 py-1 rounded-pill fw-bold mb-4 small">
                  🎓 Học Viên (Cấp 3)
                </p>
              )}

              <button
                className="btn btn-outline-warning fw-bold w-100 rounded-pill mb-2"
                data-bs-toggle="modal"
                data-bs-target="#editProfileModal"
                onClick={handleOpenModal}
              >
                <i className="fa-solid fa-pen-to-square me-2"></i> Cập nhật hồ
                sơ
              </button>

              <button
                className="btn btn-light fw-bold w-100 rounded-pill text-muted border"
                onClick={handleSyncData}
                disabled={isSyncing}
              >
                <i
                  className={`fa-solid fa-rotate me-2 ${isSyncing ? "fa-spin" : ""}`}
                ></i>
                {isSyncing ? "Đang đồng bộ..." : "Đồng bộ dữ liệu"}
              </button>
            </div>
          </div>

          {/* Biểu mẫu hiển thị chi tiết thông tin liên hệ và Bảng điều khiển nghiệp vụ */}
          <div className="col-md-8">
            <div className="card shadow-sm border-0 rounded-4 p-4 h-100 text-start">
              <h5 className="fw-bold mb-4 border-bottom pb-2">
                Thông tin liên hệ
              </h5>

              <div className="row mb-4">
                <div className="col-sm-6 mb-3">
                  <p className="text-muted mb-1 small">Họ và tên</p>
                  <strong className="text-dark">
                    {userInfo?.hoTen || "Chưa cập nhật"}
                  </strong>
                </div>
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

              {/* Mô hình hiển thị giao diện có điều kiện (Conditional Dashboard Rendering) dựa trên RBAC */}
              {isLevel1 || isLevel2 ? (
                <>
                  <h5
                    className="fw-bold mb-3 border-bottom pb-2 mt-4 text-primary text-uppercase"
                    style={{ fontSize: "0.95rem", letterSpacing: "0.5px" }}
                  >
                    <i className="fa-solid fa-toolbox me-2"></i> Bảng điều khiển
                    Giáo vụ
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="card h-100 border border-primary border-opacity-25 shadow-sm rounded-3 bg-white">
                        <div className="card-body d-flex flex-column text-start">
                          <h6 className="fw-bold text-dark mb-2">
                            <i className="fa-solid fa-book-open text-primary me-2"></i>{" "}
                            Quản lý Khóa học
                          </h6>
                          <p className="text-muted small mb-3">
                            {isLevel1
                              ? "Quyền hạn chuyên cao: Thêm mới, chỉnh sửa, xóa khóa học."
                              : "Quyền hạn vận hành: Đề nghị thêm mới hoặc cập nhật nội dung (Không quyền Xóa)."}
                          </p>
                          <div className="mt-auto">
                            <button
                              className="btn btn-primary btn-sm fw-bold w-100 rounded-2"
                              onClick={() => router.push("/admin/khoahoc")}
                            >
                              Truy cập hệ thống
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card h-100 border border-success border-opacity-25 shadow-sm rounded-3 bg-white">
                        <div className="card-body d-flex flex-column text-start">
                          <h6 className="fw-bold text-dark mb-2">
                            <i className="fa-solid fa-users text-success me-2"></i>{" "}
                            Quản lý Người dùng
                          </h6>
                          <p className="text-muted small mb-3">
                            {isLevel1
                              ? "Quyền hạn chuyên cao: Quản lý Giáo vụ, Học viên, Xét duyệt và Xóa tài khoản."
                              : "Quyền hạn giới hạn: Thêm/Sửa thông tin Học viên (Không quyền Xóa)."}
                          </p>
                          <div className="mt-auto">
                            <button
                              className="btn btn-success btn-sm fw-bold w-100 rounded-2"
                              onClick={() => router.push("/admin/nguoidung")}
                            >
                              Truy cập hệ thống
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h5
                    className="fw-bold mb-3 border-bottom pb-2 mt-4 text-success text-uppercase"
                    style={{ fontSize: "0.95rem", letterSpacing: "0.5px" }}
                  >
                    <i className="fa-solid fa-graduation-cap me-2"></i> Khóa học
                    đã đăng ký
                  </h5>
                  <div className="row g-3 text-start">
                    {loading || isSyncing ? (
                      <div className="col-12 text-center py-4">
                        <span className="spinner-border text-success"></span>
                      </div>
                    ) : myCourses.length > 0 ? (
                      myCourses.map((khoaHoc: any, index: number) => (
                        <div className="col-md-6" key={index}>
                          <div className="card h-100 border shadow-sm rounded-3">
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
                      ))
                    ) : (
                      <div className="col-12">
                        <div className="alert alert-warning rounded-3 border-0">
                          <i className="fa-solid fa-face-frown me-2"></i> Bạn
                          chưa đăng ký khóa học nào! Hãy ra trang chủ lựa chọn
                          nhé.
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

      {/* --- CẤU TRÚC MODAL FORM CHỈNH SỬA THÔNG TIN --- */}
      <div
        className="modal fade"
        id="editProfileModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow-lg text-start">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">Chỉnh sửa hồ sơ</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitUpdate}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={editData.hoTen}
                    onChange={(e) =>
                      setEditData({ ...editData, hoTen: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="form-control bg-light"
                    value={editData.soDT}
                    onChange={(e) =>
                      setEditData({ ...editData, soDT: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-danger">
                    Mật khẩu xác nhận (*)
                  </label>
                  <input
                    type="password"
                    className="form-control border-danger"
                    placeholder="Nhập mật khẩu để lưu"
                    value={editData.matKhau}
                    onChange={(e) =>
                      setEditData({ ...editData, matKhau: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="d-flex gap-2 w-100">
                  <button
                    type="button"
                    className="btn btn-light w-50 fw-bold"
                    data-bs-dismiss="modal"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning w-50 fw-bold"
                    data-bs-dismiss="modal"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
