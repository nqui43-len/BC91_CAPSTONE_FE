import React from "react";
import Link from "next/link";
import { Course } from "../types/Course";

// Đây là định nghĩa "Nhân bánh" (Props).
// Khuôn này bắt buộc phải được truyền vào một biến tên là 'course' có kiểu dữ liệu là 'Course'.
interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    // Cái khuôn này chứa toàn bộ giao diện, link, và hiệu ứng của 1 thẻ khóa học
    <Link
      href={`/chitiet/${course.maKhoaHoc}`}
      className="text-decoration-none d-block h-100"
    >
      <div
        className="card h-100 shadow-sm border-0 text-dark"
        style={{ transition: "transform 0.3s" }}
        onMouseOver={(e) =>
          (e.currentTarget.style.transform = "translateY(-5px)")
        }
        onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <img
          src={course.hinhAnh}
          className="card-img-top"
          alt={course.tenKhoaHoc}
          style={{ height: "160px", objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/300x160/png?text=Course+Image";
          }}
        />

        <div className="card-body d-flex flex-column">
          <h6 className="card-title fw-bold">{course.tenKhoaHoc}</h6>
          <div
            className="card-text text-muted small mb-4"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              height: "40px",
            }}
            dangerouslySetInnerHTML={{ __html: course.moTa }}
          />
          <div className="w-100 mt-auto">
            {/* Đây là cái <button> đã được "ngụy trang" thành <div> */}
            <div className="btn btn-outline-warning w-100 fw-bold text-dark">
              Đăng ký ngay
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
