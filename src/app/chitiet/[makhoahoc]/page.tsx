"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"; // THÊM CÔNG CỤ CHUYỂN TRANG
import { courseService } from "../../../services/courseService";
import { Course } from "../../../types/Course"; // THÊM ĐỊNH NGHĨA KIỂU DỮ LIỆU CHO KHÓA HỌC
import CourseList from "../../../components/CourseList"; // THÊM CÁI ĐĨA ĐỰNG KHÓA HỌC HÔM TRƯỚC

export default function CourseDetail() {
  const params = useParams();
  const makhoahoc = params?.makhoahoc as string;

  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (makhoahoc) {
        const data = await courseService.getCourseDetail(makhoahoc);
        if (data && data.content) {
          setCourse(data.content);
        }
      }
    };
    fetchDetail();
  }, [makhoahoc]);

  if (!course) {
    return (
      <div
        className="container mt-5 py-5 text-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-warning" role="status"></div>
        <h4 className="mt-3">Đang tải thông tin khóa học...</h4>
      </div>
    );
  }

  return (
    <main className="bg-light" style={{ minHeight: "80vh" }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .btn-register-pulse { animation: pulse-warning 2s infinite; transition: all 0.3s ease; }
        .btn-register-pulse:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(234, 179, 8, 0.4); }
        @keyframes pulse-warning {
          0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(234, 179, 8, 0); }
          100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
        }
        .glass-card { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
      `,
        }}
      />

      {/* KHỐI 1: BANNER HERO */}
      <section
        className="text-light py-5"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.7)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderBottom: "3px solid #eab308",
        }}
      >
        <div className="container py-4">
          {/* SỬA LỖI 2: Thêm nút Quay lại trang chủ */}
          <Link
            href="/"
            className="text-warning text-decoration-none mb-4 d-inline-block fw-bold fs-6"
          >
            <i className="fa-solid fa-arrow-left me-2"></i> Quay lại trang chủ
          </Link>

          <div className="row align-items-center">
            <div className="col-lg-7 mb-4 mb-lg-0">
              <div className="mb-3">
                <span className="badge bg-warning text-dark me-2 py-2 px-3 fw-bold">
                  🔥 Thực chiến
                </span>
                <span className="badge border border-warning text-warning py-2 px-3">
                  Cấp chứng chỉ
                </span>
              </div>
              <h1
                className="fw-bold text-uppercase display-5 mb-4"
                style={{
                  color: "#eab308",
                  textShadow: "0 0 15px rgba(234,179,8,0.3)",
                }}
              >
                {course.tenKhoaHoc}
              </h1>
              <div className="d-flex align-items-center mb-4 text-light">
                <div className="text-warning me-3 fs-5">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <span className="fs-5 border-start border-secondary ps-3">
                  <i className="fa-solid fa-eye me-2 text-warning"></i>
                  <span className="fw-bold text-white">
                    {course.luotXem}
                  </span>{" "}
                  học viên đã tham gia
                </span>
              </div>
              <button className="btn btn-warning btn-lg fw-bold px-5 py-3 rounded-pill btn-register-pulse text-dark">
                ĐĂNG KÝ HỌC NGAY
              </button>
            </div>
            <div className="col-lg-5 text-center">
              <div
                className="glass-card p-2 rounded-4"
                style={{ display: "inline-block" }}
              >
                <img
                  src={course.hinhAnh}
                  alt={course.tenKhoaHoc}
                  className="img-fluid rounded-4 shadow-lg"
                  style={{
                    maxHeight: "350px",
                    objectFit: "cover",
                    border: "2px solid rgba(234, 179, 8, 0.3)",
                  }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://placehold.co/600x400/1e293b/eab308?text=Course+Image";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KHỐI 2: MÔ TẢ KHÓA HỌC */}
      <section className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-5">
                <h3 className="fw-bold mb-4 d-flex align-items-center border-bottom pb-3">
                  <i className="fa-solid fa-book-open text-warning me-3 fs-2"></i>
                  Thông tin khóa học
                </h3>

                {/* SỬA LỖI 1: Đã xóa phần text tĩnh thừa thãi, chỉ dịch thẻ HTML của API */}
                <div
                  className="fs-6 text-dark lh-lg"
                  dangerouslySetInnerHTML={{ __html: course.moTa }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SỬA LỖI 3: KHÓA HỌC LIÊN QUAN (Tái sử dụng Component) */}
      <section className="container mb-5 pb-5">
        <h3 className="fw-bold mb-4 border-bottom pb-2">
          Các khóa học khác bạn có thể thích
        </h3>

        {/* Chỉ cần 1 dòng code này là chúng ta gọi lại toàn bộ 8 khóa học và giao diện thẻ hôm trước! */}
        <CourseList />
      </section>
    </main>
  );
}
