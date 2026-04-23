// Nằm ở file src/app/chitiet/[makhoahoc]/page.tsx
"use client"; // Bắt buộc vì có dùng hooks (useEffect, useParams)

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Công cụ đọc địa chỉ URL
import { courseService } from "../../../services/courseService";
import { Course } from "../../../types/Course";

export default function CourseDetail() {
  const params = useParams();
  const makhoahoc = params?.makhoahoc as string;

  const [course, setCourse] = useState<Course | null>(null);

  // Vừa mở trang là gọi API lấy dữ liệu ngay
  useEffect(() => {
    const fetchDetail = async () => {
      if (makhoahoc) {
        // Ép kiểu makhoahoc thành string để TypeScript không phàn nàn
        const data = await courseService.getCourseDetail(makhoahoc as string);

        // Nhớ cấu trúc "content" của Swagger nhà em không? Nó nằm ở đây:
        if (data && data.content) {
          setCourse(data.content);
        }
      }
    };

    fetchDetail();
  }, [makhoahoc]);

  // Trong lúc chờ API trả dữ liệu về (khoảng 0.5s), mình hiện chữ Đang tải...
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

  // Khi có dữ liệu rồi thì "lên mâm" thôi!
  return (
    <main style={{ minHeight: "80vh" }}>
      {/* KHỐI 1: BANNER TÊN KHÓA HỌC */}
      <section className="bg-dark text-light py-5 border-bottom border-warning border-3">
        <div className="container py-4">
          <div className="row align-items-center">
            {/* Cột trái: Thông tin */}
            <div className="col-md-7">
              <h1 className="text-warning fw-bold text-uppercase display-5 mb-3">
                {course.tenKhoaHoc}
              </h1>
              <p className="fs-5 text-light">
                <i className="fa-solid fa-star text-warning me-1"></i>
                <i className="fa-solid fa-star text-warning me-1"></i>
                <i className="fa-solid fa-star text-warning me-1"></i>
                <i className="fa-solid fa-star text-warning me-1"></i>
                <i className="fa-solid fa-star text-warning me-1"></i>
                <span className="ms-2">({course.luotXem} lượt xem)</span>
              </p>
              <button className="btn btn-warning btn-lg fw-bold mt-4 px-5">
                ĐĂNG KÝ NGAY
              </button>
            </div>

            {/* Cột phải: Ảnh khóa học */}
            <div className="col-md-5 text-center mt-4 mt-md-0">
              <img
                src={course.hinhAnh}
                alt={course.tenKhoaHoc}
                className="img-fluid rounded shadow-lg border border-secondary"
                style={{ maxHeight: "300px", objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://placehold.co/600x300/png?text=Course+Image";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* KHỐI 2: MÔ TẢ KHÓA HỌC */}
      <section className="container mt-5 mb-5 pb-5">
        <h3 className="fw-bold border-bottom pb-2 mb-4">Giới thiệu khóa học</h3>

        {/* Lại dùng "ma thuật" dịch thẻ HTML như hôm trước */}
        <div
          className="fs-6 text-secondary lh-lg"
          dangerouslySetInnerHTML={{ __html: course.moTa }}
        />
      </section>
    </main>
  );
}
