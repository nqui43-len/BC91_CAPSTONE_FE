"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { courseService } from "@/src/services/courseService";
import CourseCard from "@/src/components/CourseCard";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/redux/store";
import { fetchProfile } from "@/src/redux/userSlice";

export default function CourseDetailPage() {
  const { userInfo, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch<AppDispatch>();

  const [relatedCourses, setRelatedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Quản lý trạng thái Modal thu thập thông tin Lead (Khách hàng chưa có tài khoản)
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState({ hoTen: "", soDT: "" });

  // Trích xuất mã khóa học (Dynamic Route Parameter) từ URL thông qua App Router Params
  const params = useParams();
  const currentCourseCode = params?.makhoahoc as string;

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const allCoursesData = await courseService.getCourseList();
        const allCourses = allCoursesData?.content || allCoursesData || [];
        setRelatedCourses(allCourses.slice(0, 4));
      } catch (error) {
        console.log("Lỗi tải khóa học liên quan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, []);

  // Kiểm tra xem khóa học hiện tại đã nằm trong danh mục ghi danh của User chưa
  const daGhiDanh = userInfo?.chiTietKhoaHocGhiDanh?.some(
    (course: any) => course.maKhoaHoc === currentCourseCode,
  );

  // Luồng xử lý sự kiện Đăng ký khóa học (Tự động rẽ nhánh theo Auth State)
  const handleEnrollClick = async () => {
    // 1. Trường hợp Khách hàng chưa có tài khoản: Hiển thị Modal thu thập thông tin tư vấn
    if (!isLoggedIn) {
      setShowLeadModal(true);
      return;
    }

    // 2. Trường hợp Học viên đã Đăng nhập: Thực hiện đăng ký trực tiếp qua API
    if (!userInfo?.taiKhoan) return;
    setIsEnrolling(true);
    try {
      await courseService.dangKyKhoaHoc({
        maKhoaHoc: currentCourseCode,
        taiKhoan: userInfo.taiKhoan,
      });
      alert("🎉 Đăng ký khóa học thành công! Chúc bạn học tốt.");
      dispatch(fetchProfile());
    } catch (error: any) {
      const errorMsg =
        typeof error === "string" ? error : JSON.stringify(error);
      alert("❌ Lỗi ghi danh: " + errorMsg);
    } finally {
      setIsEnrolling(false);
    }
  };

  // Tiếp nhận dữ liệu Lead Form từ Khách hàng
  const handleSubmitLead = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(
      `Cảm ơn bạn ${leadForm.hoTen}! Giáo vụ CyberSoft sẽ liên hệ với bạn qua số điện thoại ${leadForm.soDT} trong thời gian sớm nhất để hỗ trợ ghi danh.`,
    );
    setShowLeadModal(false);
    setLeadForm({ hoTen: "", soDT: "" });
  };

  if (loading) {
    return (
      <div className="text-center mt-5 pt-5">
        <div className="spinner-border text-warning"></div>
      </div>
    );
  }

  return (
    <main className="bg-white pb-5" style={{ minHeight: "100vh" }}>
      {/* --- BANNER ĐẦU TRANG --- */}
      <div className="bg-warning py-4 text-start">
        <div className="container">
          <h3
            className="fw-bold text-dark mb-1 text-uppercase"
            style={{ letterSpacing: "1px" }}
          >
            THÔNG TIN KHÓA HỌC
          </h3>
          <p className="text-dark mb-0 small fw-bold text-uppercase opacity-75">
            TIẾN LÊN VÀ KHÔNG CHẦN CHỪ !!!
          </p>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          {/* --- CỘT TRÁI: NỘI DUNG CHI TIẾT --- */}
          <div className="col-lg-8 pe-lg-5 text-start">
            <h2
              className="fw-extrabold text-dark mb-4 text-uppercase tracking-tight"
              style={{ fontSize: "2.2rem" }}
            >
              LẬP TRÌNH FRONT-END CHUYÊN NGHIỆP
            </h2>

            {/* Khối siêu dữ liệu Giảng viên & Đánh giá */}
            <div className="row mb-4 align-items-center bg-light p-3 rounded-3 g-3">
              <div className="col-md-4 d-flex align-items-center">
                <img
                  src="https://i.pravatar.cc/150?img=68"
                  className="rounded-circle me-3 border border-2 border-warning"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  alt="Giảng viên"
                />
                <div>
                  <p className="mb-0 text-muted small">Giảng viên</p>
                  <p className="mb-0 fw-bold text-dark">Robert Ngô Ngọc</p>
                </div>
              </div>
              <div className="col-md-4 d-flex align-items-center">
                <div
                  className="rounded-circle bg-success bg-opacity-10 text-success p-2 me-3 d-flex align-items-center justify-content-center"
                  style={{ width: "50px", height: "50px" }}
                >
                  <i className="fa-solid fa-laptop-code fs-4"></i>
                </div>
                <div>
                  <p className="mb-0 text-muted small">Lĩnh vực</p>
                  <p className="mb-0 fw-bold text-dark">Thiết kế Web</p>
                </div>
              </div>
              <div className="col-md-4 text-md-end">
                <div className="text-warning fs-6 mb-1">
                  <i className="fa-solid fa-star me-1"></i>
                  <i className="fa-solid fa-star me-1"></i>
                  <i className="fa-solid fa-star me-1"></i>
                  <i className="fa-solid fa-star me-1"></i>
                  <i className="fa-solid fa-star-half-stroke me-2"></i>
                  <span className="text-dark fw-bold">4.5</span>
                </div>
                <p className="text-muted small mb-0 fw-medium">100 đánh giá</p>
              </div>
            </div>

            <div
              className="text-dark lh-lg mb-5 text-justify fs-6"
              style={{ textAlign: "justify" }}
            >
              React.js là thư viện JavaScript phổ biến nhất mà bạn có thể sử
              dụng và tìm hiểu ngày nay để xây dựng giao diện người dùng hiện
              đại, phản ứng nhanh cho web. Khóa học này dạy bạn về React chuyên
              sâu, từ cơ bản, từng bước đi sâu vào tất cả các kiến thức cơ bản
              cốt lõi, khám phá rất nhiều ví dụ và cũng giới thiệu cho bạn các
              khái niệm nâng cao. Bạn sẽ nhận được tất cả lý thuyết, hướng dẫn
              ví dụ và bài thực hành, bài tập tập cũng như vô số kiến thức quan
              trọng bị hầu hết các nguồn khác bỏ qua - sau cùng, có một lý do
              tại sao khóa học này lại rất lớn!
            </div>

            {/* Box cam kết chuẩn đầu ra */}
            <div className="card border-0 bg-light p-4 rounded-4 mb-5 shadow-sm">
              <h4 className="fw-bold text-dark mb-4">Những gì bạn sẽ học</h4>
              <div className="row g-3">
                {[
                  "Xây dựng các ứng dụng web mạnh mẽ, nhanh chóng, thân thiện với người dùng và phản ứng nhanh",
                  "Thông thạo chuỗi công cụ hỗ trợ React, bao gồm NPM, Webpack, Babel và ES6 / ES2015",
                  "Đăng ký công việc được trả lương cao hoặc làm freelancer trong một trong những lĩnh vực được yêu cầu nhiều nhất",
                  "Nhận ra sức mạnh của việc xây dựng các thành phần có thể tái kết hợp",
                  "Cung cấp trải nghiệm người dùng tuyệt vời bằng cách tận dụng sức mạnh của JavaScript một cách dễ dàng",
                  "Nắm vững các khái niệm cơ bản đằng sau việc cấu trúc các ứng dụng Redux",
                ].map((item, index) => (
                  <div
                    className="col-md-6 d-flex align-items-start"
                    key={index}
                  >
                    <i className="fa-solid fa-check text-warning mt-1 me-3 fs-5 fw-bold"></i>
                    <span className="text-dark fw-medium fs-6">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Giáo trình chi tiết khóa học */}
            <h4 className="fw-bold text-dark mb-4 text-uppercase">
              Nội dung khóa học
            </h4>
            <div
              className="accordion border shadow-sm rounded-3 mb-5"
              id="courseAccordion"
            >
              <div className="accordion-item border-0 border-bottom">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button fw-bold bg-light text-dark py-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                  >
                    MỤC 1: GIỚI THIỆU{" "}
                    <span className="badge bg-success bg-opacity-10 text-success ms-3 border border-success border-opacity-25 small fw-normal">
                      XEM TRƯỚC
                    </span>
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  data-bs-parent="#courseAccordion"
                >
                  <div className="accordion-body p-0">
                    <ul className="list-group list-group-flush">
                      {[
                        "Các khái niệm về React Component",
                        "Thiết lập môi trường cho Windows",
                        "Tạo ứng dụng React - React-Scripts",
                      ].map((lesson, idx) => (
                        <li
                          className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 border-light"
                          key={idx}
                        >
                          <span className="text-dark fw-medium">
                            <i className="fa-regular fa-circle-play text-success me-3 fs-5"></i>
                            {lesson}
                          </span>
                          <span className="text-muted small">
                            <i className="fa-regular fa-clock me-1"></i> 14:35
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="accordion-item border-0">
                <h2 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed fw-bold bg-light text-dark py-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                  >
                    MỤC 2: KIẾN THỨC CĂN BẢN{" "}
                    <span className="badge bg-success bg-opacity-10 text-success ms-3 border border-success border-opacity-25 small fw-normal">
                      XEM TRƯỚC
                    </span>
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  data-bs-parent="#courseAccordion"
                >
                  <div className="accordion-body p-0">
                    <ul className="list-group list-group-flush">
                      {[
                        "Trang chủ và thành phần thư mục",
                        "Hướng dẫn khóa học + Liên kết Github",
                        "Tệp CSS và SCSS",
                      ].map((lesson, idx) => (
                        <li
                          className="list-group-item d-flex justify-content-between align-items-center py-3 px-4"
                          key={idx}
                        >
                          <span className="text-dark fw-medium">
                            <i className="fa-regular fa-circle-play text-success me-3 fs-5"></i>
                            {lesson}
                          </span>
                          <span className="text-muted small">
                            <i className="fa-regular fa-clock me-1"></i> 14:35
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: SIDEBAR THANH TOÁN / ĐĂNG KÝ --- */}
          <div className="col-lg-4">
            <div
              className="card shadow-lg border-0 rounded-4 sticky-top"
              style={{ top: "110px", zIndex: 5 }}
            >
              <img
                src="/logo.png"
                className="card-img-top rounded-top-4"
                alt="Front-End Course"
                style={{ height: "230px", objectFit: "fill" }}
                onError={(e) => {
                  // Fallback hình ảnh: Thay thế bằng asset cục bộ nếu URL ảnh động bị lỗi hoặc broken
                  e.currentTarget.src = "/logo.png";
                }}
              />
              <div className="card-body p-4 text-start">
                <h3
                  className="fw-extrabold text-end mb-4 text-dark d-flex align-items-center justify-content-end"
                  style={{ fontSize: "1.8rem" }}
                >
                  <i className="fa-solid fa-bolt text-warning me-2 animate-pulse"></i>
                  500.000<sup>đ</sup>
                </h3>

                {/* Hiển thị Nút Đăng ký theo trạng thái ghi danh (Conditional Rendering) */}
                {daGhiDanh ? (
                  <button className="btn btn-secondary btn-lg fw-bold w-100 py-2.5 mb-4 rounded-3 text-uppercase disabled">
                    <i className="fa-solid fa-check-circle me-2"></i>ĐÃ GHI DANH
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-success btn-lg fw-bold w-100 py-2.5 mb-4 rounded-3 text-uppercase"
                    onClick={handleEnrollClick}
                    disabled={isEnrolling}
                    style={{ borderWidth: "2px", letterSpacing: "0.5px" }}
                  >
                    {isEnrolling ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>{" "}
                        Đang xử lý...
                      </>
                    ) : (
                      "ĐĂNG KÝ"
                    )}
                  </button>
                )}

                <ul className="list-group list-group-flush text-muted small">
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-light">
                    <span className="text-dark fw-medium">
                      Ghi danh:{" "}
                      <strong className="text-dark ms-1">10 học viên</strong>
                    </span>
                    <i className="fa-solid fa-user-graduate text-warning fs-5"></i>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-light">
                    <span className="text-dark fw-medium">
                      Thời gian:{" "}
                      <strong className="text-dark ms-1">18 giờ</strong>
                    </span>
                    <i className="fa-solid fa-clock text-warning fs-5"></i>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-light">
                    <span className="text-dark fw-medium">
                      Bài học: <strong className="text-dark ms-1">10</strong>
                    </span>
                    <i className="fa-solid fa-book text-warning fs-5"></i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- KHỐI ĐỀ XUẤT KHÓA HỌC LIÊN QUAN --- */}
      <div className="container mt-5 pt-5 border-top text-start">
        <h4 className="fw-bold text-dark mb-4 border-start border-warning border-4 ps-3 text-uppercase">
          Khóa học tham khảo
        </h4>
        <div className="row g-4">
          {relatedCourses.map((relatedCourse, index) => (
            <div className="col-md-3" key={index}>
              <CourseCard course={relatedCourse} />
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL THU THẬP THÔNG TIN --- */}
      {showLeadModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-success">
                  Đăng ký tư vấn khóa học
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLeadModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4 text-start">
                <p className="text-muted small mb-4">
                  Bạn chưa có tài khoản trên hệ thống. Vui lòng để lại thông
                  tin, Giáo vụ của chúng tôi sẽ liên hệ để tư vấn và tạo tài
                  khoản cho bạn!
                </p>
                <form onSubmit={handleSubmitLead}>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-dark small">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      placeholder="Nhập họ tên của bạn"
                      value={leadForm.hoTen}
                      onChange={(e) =>
                        setLeadForm({ ...leadForm, hoTen: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark small">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      className="form-control bg-light"
                      placeholder="Nhập số điện thoại liên hệ"
                      value={leadForm.soDT}
                      onChange={(e) =>
                        setLeadForm({ ...leadForm, soDT: e.target.value })
                      }
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success fw-bold w-100 py-2 rounded-3"
                  >
                    Gửi yêu cầu tư vấn
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
