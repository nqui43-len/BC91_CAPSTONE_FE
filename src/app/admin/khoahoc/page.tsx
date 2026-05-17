"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/src/redux/store";
import { courseService } from "@/src/services/courseService";
import Link from "next/link";

export default function CourseManagementPage() {
  const router = useRouter();
  const { userInfo, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  );

  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // --- STATE CHO MODAL THÊM/SỬA ---
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    maKhoaHoc: "",
    biDanh: "",
    tenKhoaHoc: "",
    moTa: "",
    luotXem: 0,
    danhGia: 0,
    hinhAnh: "",
    maNhom: "GP01", // Luôn cố định theo mã nhóm của em
    ngayTao: "",
    maDanhMucKhoaHoc: "BackEnd", // Giá trị mặc định
    taiKhoanNguoiTao: userInfo?.taiKhoan || "",
  });

  // 1. PHÂN QUYỀN
  const isLevel1 = userInfo?.taiKhoan === "admin_gv";
  const isLevel2 =
    userInfo?.maLoaiNguoiDung === "GV" && userInfo?.taiKhoan !== "admin_gv";

  // 2. TẢI DỮ LIỆU
  useEffect(() => {
    if (!isLoggedIn || (!isLevel1 && !isLevel2)) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy danh sách khóa học
        const courseData = await courseService.getCourseList();
        setCourses(courseData?.content || courseData || []);

        // Lấy danh mục để đổ vào thẻ Select
        const catData = await courseService.getCategoryList();
        setCategories(catData?.content || catData || []);
      } catch (error) {
        console.log("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, isLevel1, isLevel2, router, refreshTrigger]);

  // =====================================================================
  // HÀM XỬ LÝ SỰ KIỆN
  // =====================================================================

  const handleDeleteCourse = async (maKhoaHoc: string) => {
    if (
      window.confirm(
        `⚠️ Bạn có chắc chắn muốn xóa khóa học "${maKhoaHoc}" không?`,
      )
    ) {
      try {
        await courseService.deleteCourse(maKhoaHoc);
        alert("✅ Đã xóa khóa học thành công!");
        setRefreshTrigger((prev) => prev + 1);
      } catch (error: any) {
        alert("❌ Xóa thất bại: " + error);
      }
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    // Tự động lấy ngày hôm nay theo format dd/mm/yyyy
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    setFormData({
      maKhoaHoc: "",
      biDanh: "",
      tenKhoaHoc: "",
      moTa: "",
      luotXem: 0,
      danhGia: 0,
      hinhAnh: "",
      maNhom: "GP01",
      ngayTao: formattedDate,
      maDanhMucKhoaHoc:
        categories.length > 0 ? categories[0].maDanhMuc : "BackEnd",
      taiKhoanNguoiTao: userInfo?.taiKhoan || "",
    });
  };

  const handleOpenEdit = (course: any) => {
    setIsEditMode(true);
    setFormData({
      maKhoaHoc: course.maKhoaHoc,
      biDanh: course.biDanh || "",
      tenKhoaHoc: course.tenKhoaHoc,
      moTa: course.moTa,
      luotXem: course.luotXem,
      danhGia: 0, // API CyberSoft đôi khi không trả về đánh giá, set tạm 0
      hinhAnh: course.hinhAnh,
      maNhom: "GP01",
      ngayTao: course.ngayTao,
      maDanhMucKhoaHoc:
        course.danhMucKhoaHoc?.maDanhMucKhoahoc || course.maDanhMucKhoaHoc,
      taiKhoanNguoiTao: course.nguoiTao?.taiKhoan || userInfo?.taiKhoan,
    });
  };

  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await courseService.updateCourse(formData);
        alert("🎉 Cập nhật khóa học thành công!");
      } else {
        await courseService.addCourse(formData);
        alert("🎉 Thêm khóa học mới thành công!");
      }
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      alert("❌ Có lỗi xảy ra: " + error);
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="text-center mt-5 pt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <main
      className="bg-light pb-5"
      style={{ minHeight: "100vh", paddingTop: "90px" }}
    >
      <div className="container mt-4">
        {/* THANH ĐIỀU HƯỚNG */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <Link
              href="/thongtin"
              className="btn btn-outline-secondary btn-sm mb-2"
            >
              <i className="fa-solid fa-arrow-left me-2"></i>Quay lại Hồ sơ
            </Link>
            <h2 className="fw-bold text-primary mb-0">
              <i className="fa-solid fa-book-open me-2"></i> QUẢN LÝ KHÓA HỌC
            </h2>
            <p className="text-muted small mt-1">
              Quyền hiện tại:{" "}
              {isLevel1 ? (
                <span className="text-danger fw-bold">
                  Super Admin (Toàn quyền)
                </span>
              ) : (
                <span className="text-primary fw-bold">
                  Giáo vụ (Chỉ Thêm/Sửa)
                </span>
              )}
            </p>
          </div>

          <button
            className="btn btn-primary fw-bold shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#courseModal"
            onClick={handleOpenAdd}
          >
            <i className="fa-solid fa-plus me-2"></i> Thêm khóa học
          </button>
        </div>

        {/* BẢNG DANH SÁCH */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  <th scope="col" className="py-3 px-4">
                    Mã KH
                  </th>
                  <th scope="col" className="py-3">
                    Tên khóa học
                  </th>
                  <th scope="col" className="py-3">
                    Hình ảnh
                  </th>
                  <th scope="col" className="py-3">
                    Lượt xem
                  </th>
                  <th scope="col" className="py-3">
                    Người tạo
                  </th>
                  <th scope="col" className="py-3 text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={index}>
                    <td className="px-4 fw-bold text-dark">
                      {course.maKhoaHoc}
                    </td>
                    <td
                      style={{ maxWidth: "250px" }}
                      className="text-truncate"
                      title={course.tenKhoaHoc}
                    >
                      {course.tenKhoaHoc}
                    </td>
                    <td>
                      <img
                        src={course.hinhAnh}
                        alt="course"
                        style={{
                          width: "60px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/60x40?text=IMG";
                        }}
                      />
                    </td>
                    <td>{course.luotXem}</td>
                    <td>{course.nguoiTao?.hoTen || "Ẩn danh"}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Chỉnh sửa"
                        data-bs-toggle="modal"
                        data-bs-target="#courseModal"
                        onClick={() => handleOpenEdit(course)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>

                      {/* KHÓA QUYỀN XÓA NẾU LÀ CẤP 2 */}
                      {isLevel1 ? (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Xóa khóa học"
                          onClick={() => handleDeleteCourse(course.maKhoaHoc)}
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

      {/* =====================================================================
          MODAL: THÊM / SỬA KHÓA HỌC
          ===================================================================== */}
      <div
        className="modal fade"
        id="courseModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow-lg">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold text-primary">
                {isEditMode ? "Chỉnh sửa Khóa học" : "Thêm Khóa học mới"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmitCourse}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      Mã khóa học
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.maKhoaHoc}
                      onChange={(e) =>
                        setFormData({ ...formData, maKhoaHoc: e.target.value })
                      }
                      disabled={isEditMode}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      Tên khóa học
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.tenKhoaHoc}
                      onChange={(e) =>
                        setFormData({ ...formData, tenKhoaHoc: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      Danh mục
                    </label>
                    <select
                      className="form-select"
                      value={formData.maDanhMucKhoaHoc}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maDanhMucKhoaHoc: e.target.value,
                        })
                      }
                      required
                    >
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat.maDanhMuc}>
                          {cat.tenDanhMuc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      Link Hình ảnh (URL)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.hinhAnh}
                      onChange={(e) =>
                        setFormData({ ...formData, hinhAnh: e.target.value })
                      }
                      placeholder="https://..."
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">
                    Mô tả khóa học
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={formData.moTa}
                    onChange={(e) =>
                      setFormData({ ...formData, moTa: e.target.value })
                    }
                    required
                  ></textarea>
                </div>

                <div className="d-flex gap-2 w-100 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-light px-4 fw-bold"
                    data-bs-dismiss="modal"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-bold"
                    data-bs-dismiss="modal"
                  >
                    {isEditMode ? "Lưu thay đổi" : "Tạo khóa học"}
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
