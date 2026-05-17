"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/src/redux/store";
import { userService } from "@/src/services/userService";
import { courseService } from "@/src/services/courseService";
import Link from "next/link";

export default function UserManagementPage() {
  const router = useRouter();
  const { userInfo, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  );

  const [users, setUsers] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]); // BỘ NHỚ CHỨA TOÀN BỘ KHÓA HỌC
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // --- STATE CHO MODAL THÊM/SỬA TÀI KHOẢN ---
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    soDT: "",
    email: "",
    maLoaiNguoiDung: "HV",
    maNhom: "GP01",
  });

  // --- STATE CHO MODAL DUYỆT GHI DANH ---
  const [enrollUser, setEnrollUser] = useState<any>(null);
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [approvedCourses, setApprovedCourses] = useState<any[]>([]);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(""); // LƯU MÃ KHÓA HỌC ĐƯỢC CHỌN ĐỂ GHI DANH THỦ CÔNG

  const isLevel1 = userInfo?.taiKhoan === "admin_gv";
  const isLevel2 =
    userInfo?.maLoaiNguoiDung === "GV" && userInfo?.taiKhoan !== "admin_gv";

  useEffect(() => {
    if (!isLoggedIn || (!isLevel1 && !isLevel2)) {
      router.push("/");
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy danh sách người dùng
        const dataUsers = await userService.getUserList();
        setUsers(dataUsers?.content || dataUsers || []);

        // Lấy toàn bộ danh sách khóa học để đổ vào Dropdown Ghi danh
        const dataCourses = await courseService.getCourseList();
        setAllCourses(dataCourses?.content || dataCourses || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isLoggedIn, isLevel1, isLevel2, router, refreshTrigger]);

  // =====================================================================
  // HÀM XỬ LÝ USER (THÊM/SỬA/XÓA)
  // =====================================================================
  const handleDeleteUser = async (taiKhoan: string) => {
    if (
      window.confirm(
        `⚠️ Bạn có chắc chắn muốn xóa tài khoản "${taiKhoan}" không?`,
      )
    ) {
      try {
        await userService.deleteUser(taiKhoan);
        alert("✅ Đã xóa tài khoản thành công!");
        setRefreshTrigger((prev) => prev + 1);
      } catch (error: any) {
        alert("❌ Xóa thất bại: " + error);
      }
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData({
      taiKhoan: "",
      matKhau: "",
      hoTen: "",
      soDT: "",
      email: "",
      maLoaiNguoiDung: "HV",
      maNhom: "GP01",
    });
  };

  const handleOpenEdit = (user: any) => {
    setIsEditMode(true);
    setFormData({
      taiKhoan: user.taiKhoan,
      matKhau: "",
      hoTen: user.hoTen,
      soDT: user.soDT,
      email: user.email,
      maLoaiNguoiDung: user.maLoaiNguoiDung,
      maNhom: "GP01",
    });
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await userService.updateUserAdmin(formData);
        alert("🎉 Cập nhật thành công!");
      } else {
        await userService.addUser(formData);
        alert("🎉 Thêm người dùng mới thành công!");
      }
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      alert("❌ Có lỗi xảy ra: " + error);
    }
  };

  // =====================================================================
  // HÀM XỬ LÝ GHI DANH / XÉT DUYỆT KHÓA HỌC
  // =====================================================================
  const fetchUserCourses = async (taiKhoan: string) => {
    setEnrollLoading(true);
    try {
      const pendingData =
        await userService.LayDanhSachKhoaHocChoXetDuyet(taiKhoan);
      const approvedData =
        await userService.LayDanhSachKhoaHocDaXetDuyet(taiKhoan);

      setPendingCourses(
        Array.isArray(pendingData?.content || pendingData)
          ? pendingData?.content || pendingData
          : [],
      );
      setApprovedCourses(
        Array.isArray(approvedData?.content || approvedData)
          ? approvedData?.content || approvedData
          : [],
      );
    } catch (error) {
      setPendingCourses([]);
      setApprovedCourses([]);
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleOpenEnroll = (user: any) => {
    setEnrollUser(user);
    fetchUserCourses(user.taiKhoan);
    setSelectedCourse(""); // Xóa khóa học chọn dở lần trước
  };

  const handleApprove = async (maKhoaHoc: string) => {
    try {
      await courseService.ghiDanhKhoaHoc({
        maKhoaHoc,
        taiKhoan: enrollUser.taiKhoan,
      });
      fetchUserCourses(enrollUser.taiKhoan);
    } catch (error: any) {
      alert(
        "❌ Lỗi duyệt: " +
          (typeof error === "string" ? error : JSON.stringify(error)),
      );
    }
  };

  const handleCancelEnroll = async (maKhoaHoc: string) => {
    if (window.confirm("Bạn có chắc muốn hủy ghi danh khóa học này?")) {
      try {
        await courseService.huyGhiDanh({
          maKhoaHoc,
          taiKhoan: enrollUser.taiKhoan,
        });
        fetchUserCourses(enrollUser.taiKhoan);
      } catch (error: any) {
        alert(
          "❌ Lỗi hủy: " +
            (typeof error === "string" ? error : JSON.stringify(error)),
        );
      }
    }
  };

  // HÀM MỚI: ADMIN ÉP GHI DANH THỦ CÔNG
  const handleManualEnroll = async () => {
    if (!selectedCourse) return;
    try {
      await courseService.ghiDanhKhoaHoc({
        maKhoaHoc: selectedCourse,
        taiKhoan: enrollUser.taiKhoan,
      });
      alert("🎉 Đã gán khóa học cho học viên thành công!");
      fetchUserCourses(enrollUser.taiKhoan); // F5 lại bảng khóa học
      setSelectedCourse(""); // Reset ô chọn
    } catch (error: any) {
      alert(
        "❌ Lỗi ghi danh: " +
          (typeof error === "string" ? error : JSON.stringify(error)),
      );
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="text-center mt-5 pt-5">
        <div className="spinner-border text-success"></div>
      </div>
    );
  }

  return (
    <main
      className="bg-light pb-5"
      style={{ minHeight: "100vh", paddingTop: "90px" }}
    >
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <Link
              href="/thongtin"
              className="btn btn-outline-secondary btn-sm mb-2"
            >
              <i className="fa-solid fa-arrow-left me-2"></i>Quay lại Hồ sơ
            </Link>
            <h2 className="fw-bold text-success mb-0">
              <i className="fa-solid fa-users-gear me-2"></i> QUẢN LÝ NGƯỜI DÙNG
            </h2>
            <p className="text-muted small mt-1">
              Quyền hiện tại:{" "}
              {isLevel1 ? (
                <span className="text-danger fw-bold">
                  Super Admin (Toàn quyền)
                </span>
              ) : (
                <span className="text-primary fw-bold">
                  Giáo vụ (Chỉ Thêm/Sửa Học viên)
                </span>
              )}
            </p>
          </div>
          <button
            className="btn btn-success fw-bold shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#userModal"
            onClick={handleOpenAdd}
          >
            <i className="fa-solid fa-plus me-2"></i> Thêm người dùng
          </button>
        </div>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-success">
                <tr>
                  <th scope="col" className="py-3 px-4">
                    Tài khoản
                  </th>
                  <th scope="col" className="py-3">
                    Họ tên
                  </th>
                  <th scope="col" className="py-3">
                    Email
                  </th>
                  <th scope="col" className="py-3">
                    Số điện thoại
                  </th>
                  <th scope="col" className="py-3">
                    Loại
                  </th>
                  <th scope="col" className="py-3 text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td className="px-4 fw-bold text-dark">{user.taiKhoan}</td>
                    <td>{user.hoTen}</td>
                    <td>{user.email}</td>
                    <td>{user.soDT}</td>
                    <td>
                      {user.maLoaiNguoiDung === "GV" ? (
                        <span className="badge bg-danger bg-opacity-10 text-danger border border-danger">
                          Giáo vụ
                        </span>
                      ) : (
                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary">
                          Học viên
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-warning me-2 fw-bold"
                        title="Duyệt khóa học"
                        data-bs-toggle="modal"
                        data-bs-target="#enrollModal"
                        onClick={() => handleOpenEnroll(user)}
                      >
                        <i className="fa-solid fa-graduation-cap"></i> Ghi danh
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Chỉnh sửa"
                        data-bs-toggle="modal"
                        data-bs-target="#userModal"
                        onClick={() => handleOpenEdit(user)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      {isLevel1 ? (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Xóa tài khoản"
                          onClick={() => handleDeleteUser(user.taiKhoan)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-secondary disabled"
                          title="Bạn không có quyền xóa"
                        >
                          <i className="fa-solid fa-ban"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL 1: THÊM / SỬA USER (Bỏ qua vì y như cũ) */}
      <div
        className="modal fade"
        id="userModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow-lg">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold text-success">
                {isEditMode ? "Chỉnh sửa tài khoản" : "Thêm người dùng mới"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitUser}>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">
                      Tài khoản
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.taiKhoan}
                      onChange={(e) =>
                        setFormData({ ...formData, taiKhoan: e.target.value })
                      }
                      disabled={isEditMode}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder={
                        isEditMode ? "Bỏ trống nếu không đổi" : "Nhập mật khẩu"
                      }
                      value={formData.matKhau}
                      onChange={(e) =>
                        setFormData({ ...formData, matKhau: e.target.value })
                      }
                      required={!isEditMode}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.hoTen}
                      onChange={(e) =>
                        setFormData({ ...formData, hoTen: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.soDT}
                      onChange={(e) =>
                        setFormData({ ...formData, soDT: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">
                    Loại người dùng
                  </label>
                  <select
                    className="form-select"
                    value={formData.maLoaiNguoiDung}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maLoaiNguoiDung: e.target.value,
                      })
                    }
                    disabled={isLevel2}
                  >
                    <option value="HV">Học viên</option>
                    {isLevel1 && <option value="GV">Giáo vụ</option>}
                  </select>
                </div>
                <div className="d-flex gap-2 w-100">
                  <button
                    type="button"
                    className="btn btn-light w-50 fw-bold"
                    data-bs-dismiss="modal"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success w-50 fw-bold"
                    data-bs-dismiss="modal"
                  >
                    {isEditMode ? "Lưu thay đổi" : "Tạo tài khoản"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 2: XÉT DUYỆT & GHI DANH THỦ CÔNG */}
      <div
        className="modal fade"
        id="enrollModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow-lg">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold text-warning">
                <i className="fa-solid fa-graduation-cap me-2"></i> Quản lý Ghi
                danh
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body p-4">
              <div className="mb-4 bg-light p-3 rounded-3 border">
                Tài khoản đang thao tác:{" "}
                <strong className="text-primary ms-2">
                  {enrollUser?.hoTen}
                </strong>{" "}
                <span className="text-muted">({enrollUser?.taiKhoan})</span>
              </div>

              {/* KHU VỰC ĐỘT PHÁ: ADMIN ÉP GHI DANH */}
              <div className="mb-4 p-3 border border-warning rounded-3 bg-warning bg-opacity-10">
                <h6 className="fw-bold text-dark mb-3">
                  <i className="fa-solid fa-plus-circle text-warning me-2"></i>
                  Chỉ định khóa học cho học viên
                </h6>
                <div className="d-flex gap-2">
                  <select
                    className="form-select border-warning"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="">-- Lựa chọn khóa học --</option>
                    {allCourses.map((c, i) => (
                      <option key={i} value={c.maKhoaHoc}>
                        {c.tenKhoaHoc}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-warning fw-bold text-dark w-25"
                    onClick={handleManualEnroll}
                    disabled={!selectedCourse}
                  >
                    Gán khóa học
                  </button>
                </div>
              </div>

              {enrollLoading ? (
                <div className="text-center py-4">
                  <span className="spinner-border text-warning"></span>
                </div>
              ) : (
                <div className="row g-4 border-top pt-3 mt-1">
                  {/* CỘT 1: CHỜ XÁC THỰC */}
                  <div className="col-md-6">
                    <h6 className="fw-bold text-danger border-bottom border-danger pb-2">
                      <i className="fa-solid fa-hourglass-half me-2"></i>Chờ xác
                      thực ({pendingCourses.length})
                    </h6>
                    {pendingCourses.length === 0 ? (
                      <p className="text-muted small fst-italic">
                        Không có yêu cầu nào đang chờ.
                      </p>
                    ) : (
                      <ul className="list-group list-group-flush shadow-sm border rounded-2">
                        {pendingCourses.map((c, i) => (
                          <li
                            key={i}
                            className="list-group-item d-flex justify-content-between align-items-center py-3 bg-danger bg-opacity-10"
                          >
                            <span
                              className="small text-dark fw-medium text-truncate me-3"
                              style={{ maxWidth: "180px" }}
                              title={c.tenKhoaHoc}
                            >
                              {c.tenKhoaHoc}
                            </span>
                            <button
                              className="btn btn-sm btn-success fw-bold px-3 shadow-sm"
                              onClick={() => handleApprove(c.maKhoaHoc)}
                            >
                              <i className="fa-solid fa-check me-1"></i> Duyệt
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* CỘT 2: ĐÃ GHI DANH */}
                  <div className="col-md-6">
                    <h6 className="fw-bold text-success border-bottom border-success pb-2">
                      <i className="fa-solid fa-circle-check me-2"></i>Đã ghi
                      danh ({approvedCourses.length})
                    </h6>
                    {approvedCourses.length === 0 ? (
                      <p className="text-muted small fst-italic">
                        Học viên này chưa có khóa học nào.
                      </p>
                    ) : (
                      <ul className="list-group list-group-flush shadow-sm border rounded-2">
                        {approvedCourses.map((c, i) => (
                          <li
                            key={i}
                            className="list-group-item d-flex justify-content-between align-items-center py-3 bg-success bg-opacity-10"
                          >
                            <span
                              className="small text-dark fw-medium text-truncate me-3"
                              style={{ maxWidth: "180px" }}
                              title={c.tenKhoaHoc}
                            >
                              {c.tenKhoaHoc}
                            </span>
                            <button
                              className="btn btn-sm btn-outline-danger fw-bold shadow-sm"
                              onClick={() => handleCancelEnroll(c.maKhoaHoc)}
                            >
                              <i className="fa-solid fa-xmark me-1"></i> Hủy
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-secondary fw-bold"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
