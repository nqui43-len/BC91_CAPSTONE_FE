"use client";

import React, { useEffect, useState } from "react";
import { courseService } from "@/src/services/courseService";
import CourseCard from "@/src/components/CourseCard"; // Tái sử dụng thẻ khóa học của em

export default function CourseDetailPage() {
  const [relatedCourses, setRelatedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        // Gọi API lấy danh sách khóa học thực tế để đổ vào phần "Khóa học tham khảo" bên dưới
        const allCoursesData = await courseService.getCourseList();
        const allCourses = allCoursesData?.content || allCoursesData || [];

        // Lấy đại diện 4 khóa học đầu tiên để làm danh sách gợi ý bán chéo (Cross-selling)
        setRelatedCourses(allCourses.slice(0, 4));
      } catch (error) {
        console.log("Lỗi tải khóa học tham khảo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  return (
    <main className="bg-white pb-5" style={{ minHeight: "100vh" }}>
      {/* -----------------------------------------------------------------
          1. BANNER VÀNG RỰC RỠ TRẢI DÀI (FLUID)
          ----------------------------------------------------------------- */}
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
          {/* -----------------------------------------------------------------
              2. CỘT TRÁI (NỘI DUNG CHÍNH CHI TIẾT KHÓA HỌC - 8 CỘT)
              ----------------------------------------------------------------- */}
          <div className="col-lg-8 pe-lg-5 text-start">
            {/* Tên Khóa Học Siêu Cấp */}
            <h2
              className="fw-extrabold text-dark mb-4 text-uppercase tracking-tight"
              style={{ fontSize: "2.2rem" }}
            >
              LẬP TRÌNH FRONT-END CHUYÊN NGHIỆP
            </h2>

            {/* Khối Thông số Giảng viên / Lĩnh vực / Đánh giá */}
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

            {/* Mô tả dài hoành tráng */}
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
              tại sao khóa học này lại rất lớn! Và trong trường hợp bạn thậm chí
              không biết tại sao bạn lại muốn học React và bạn chỉ ở đây vì một
              số quảng cáo hoặc "thuật toán" - đừng lo lắng: ReactJS là một công
              nghệ quan trọng với tư cách là một nhà phát triển web và trong
              khóa học này, tôi sẽ cũng giải thích TẠI SAO điều đó lại quan
              trọng!
            </div>

            {/* Khối: Những gì bạn sẽ học */}
            <div className="card border-0 bg-light p-4 rounded-4 mb-5 shadow-sm">
              <h4 className="fw-bold text-dark mb-4">Những gì bạn sẽ học</h4>
              <div className="row g-3">
                {[
                  "Xây dựng các ứng dụng web mạnh mẽ, nhanh chóng, thân thiện với người dùng và phản ứng nhanh",
                  "Thông thạo chuỗi công cụ hỗ trợ React, bao gồm NPM, Webpack, Babel và ES6 / ES2015",
                  "Đăng ký công việc được trả lương cao hoặc làm freelancer trong một trong những lĩnh vực được yêu cầu nhiều nhất mà bạn có thể tìm thấy trong web dev ngày nay",
                  "Nhận ra sức mạnh của việc xây dựng các thành phần có thể tái kết hợp",
                  "Cung cấp trải nghiệm người dùng tuyệt vời bằng cách tận dụng sức mạnh của JavaScript một cách dễ dàng",
                  "Hãy là kỹ sư giải thích cách hoạt động của Redux cho mọi người, bởi vì bạn biết rất rõ các nguyên tắc cơ bản",
                  "Tìm hiểu tất cả về React Hooks và React Components",
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

            {/* Khối: Nội dung khóa học (Syllabus Accordion) */}
            <h4 className="fw-bold text-dark mb-4 text-uppercase">
              Nội dung khóa học
            </h4>
            <div
              className="accordion border shadow-sm rounded-3 mb-5"
              id="courseAccordion"
            >
              {/* MỤC 1 */}
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
                        "Ghi chú nhanh về dấu ngoặc kép cho string interpolation",
                      ].map((lesson, idx) => (
                        <li
                          className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 border-light bg-hover-light"
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

              {/* MỤC 2 */}
              <div className="accordion-item border-0 border-bottom">
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
                        "Trang chủ thương mại điện tử + thiết lập SASS",
                        "Tệp CSS và SCSS",
                        "React 17: Cập nhật các gói + Phiên bản React mới nhất",
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

              {/* MỤC 3 */}
              <div className="accordion-item border-0">
                <h2 className="accordion-header" id="headingThree">
                  <button
                    className="accordion-button collapsed fw-bold bg-light text-dark py-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                  >
                    MỤC 3: KIẾN THỨC CHUYÊN SÂU{" "}
                    <span className="badge bg-success bg-opacity-10 text-success ms-3 border border-success border-opacity-25 small fw-normal">
                      XEM TRƯỚC
                    </span>
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  data-bs-parent="#courseAccordion"
                >
                  <div className="accordion-body p-0">
                    <ul className="list-group list-group-flush">
                      {[
                        "connect() và mapStateToProps",
                        "Trạng thái thư mục vào Redux",
                        "Thành phần Tổng quan về Bộ sưu tập",
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

          {/* -----------------------------------------------------------------
              3. CỘT PHẢI (SIDEBAR ĐĂNG KÝ HÌNH ẢNH + GIÁ TIỀN - STICKY 4 CỘT)
              ----------------------------------------------------------------- */}
          <div className="col-lg-4">
            <div
              className="card shadow-lg border-0 rounded-4 sticky-top"
              style={{ top: "110px", zIndex: 5 }}
            >
              <img
                src="https://demo2.cybersoft.edu.vn/static/media/instrustor10.89946c43.jpg"
                className="card-img-top rounded-top-4"
                alt="Front-End Course"
                style={{ height: "230px", objectFit: "cover" }}
              />
              <div className="card-body p-4 text-start">
                {/* Giá tiền sét đánh cực bốc */}
                <h3
                  className="fw-extrabold text-end mb-4 text-dark d-flex align-items-center justify-content-end"
                  style={{ fontSize: "1.8rem" }}
                >
                  <i className="fa-solid fa-bolt text-warning me-2 animate-pulse"></i>
                  500.000<sup>đ</sup>
                </h3>

                {/* Nút Đăng ký màu xanh lá chuẩn mẫu */}
                <button
                  className="btn btn-outline-success btn-lg fw-bold w-100 py-2.5 mb-4 rounded-3 text-uppercase"
                  style={{ letterSpacing: "0.5px", borderWidth: "2px" }}
                  onClick={() =>
                    alert(
                      "Chức năng ghi danh khóa học sẽ được chúng ta xử lý hoàn chỉnh ở bài học tiếp theo!",
                    )
                  }
                >
                  ĐĂNG KÝ
                </button>

                {/* Danh sách thông số có kèm icon màu vàng */}
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
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-light">
                    <span className="text-dark fw-medium">
                      Video: <strong className="text-dark ms-1">14</strong>
                    </span>
                    <i className="fa-solid fa-photo-film text-warning fs-5"></i>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-0">
                    <span className="text-dark fw-medium">
                      Trình độ:{" "}
                      <strong className="text-dark ms-1">
                        Người mới bắt đầu
                      </strong>
                    </span>
                    <i className="fa-solid fa-database text-warning fs-5"></i>
                  </li>
                </ul>

                <div className="mt-4">
                  <input
                    type="text"
                    className="form-control py-2 text-center rounded-2 bg-light border-0"
                    placeholder="Nhập mã khuyến mãi..."
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* End Sidebar */}
        </div>
      </div>

      {/* -----------------------------------------------------------------
          4. KHỐI KHÓA HỌC THAM KHẢO (ĐỔ DỮ LIỆU ĐỘNG TỪ API BÊN DƯỚI)
          ----------------------------------------------------------------- */}
      <div className="container mt-5 pt-5 border-top text-start">
        <h4
          className="fw-bold text-dark mb-4 border-start border-warning border-4 ps-3 text-uppercase"
          style={{ letterSpacing: "0.5px" }}
        >
          Khóa học tham khảo
        </h4>
        <div className="row g-4">
          {relatedCourses.map((relatedCourse, index) => (
            <div className="col-md-3" key={index}>
              {/* Ráp ống kính tái sử dụng khuôn CourseCard cực đẹp của em */}
              <CourseCard course={relatedCourse} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
