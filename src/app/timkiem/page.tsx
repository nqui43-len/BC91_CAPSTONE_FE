"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Công cụ MỚI để đọc chữ sau dấu ?
import { courseService } from "@/src/services/courseService"; // Đường dẫn này tùy vào cấu trúc thư mục của em, nhớ kiểm tra lại nhé
import { Course } from "@/src/types/Course";
import CourseCard from "@/src/components/CourseCard"; // Tái sử dụng cái khuôn đúc bánh siêu xịn của em

export default function SearchPage() {
  // 1. Lấy tờ giấy ghi chú ra
  const searchParams = useSearchParams();
  const tuKhoa = searchParams?.get("tuKhoa"); // Rút đúng cái chữ "React" hoặc "Backend" ra

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Gọi API mỗi khi từ khóa thay đổi
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      if (tuKhoa) {
        const data = await courseService.searchCourse(tuKhoa);
        // Kiểm tra xem dữ liệu nằm ở đâu (thường là data hoặc data.content)
        if (data && typeof data === "object") {
          const courseArray = Array.isArray(data) ? data : data.content || [];
          setCourses(courseArray);
        }
      }
      setLoading(false);
    };

    fetchSearchResults();
  }, [tuKhoa]);

  if (loading) {
    return (
      <div
        className="container mt-5 py-5 text-center"
        style={{ minHeight: "60vh", paddingTop: "100px" }}
      >
        <div className="spinner-border text-warning" role="status"></div>
        <h4 className="mt-3">Đang tìm kiếm khóa học...</h4>
      </div>
    );
  }

  return (
    <main
      className="bg-light"
      style={{ minHeight: "80vh", paddingTop: "100px" }}
    >
      <div className="container py-5">
        <h2 className="fw-bold mb-4 border-start border-warning border-4 ps-3">
          Kết quả tìm kiếm cho: <span className="text-warning">"{tuKhoa}"</span>
        </h2>

        {courses.length === 0 ? (
          <div className="text-center py-5">
            <i className="fa-solid fa-box-open fa-4x text-secondary mb-3"></i>
            <h4 className="text-muted">
              Rất tiếc, không tìm thấy khóa học nào phù hợp.
            </h4>
            <p>Hãy thử tìm kiếm với một từ khóa khác xem sao!</p>
          </div>
        ) : (
          <div className="row">
            {/* BÀI TẬP CỦA EM: Vòng lặp map để in các thẻ CourseCard ra đây */}
            {courses.map((course, index) => (
              <div className="col-md-3 mb-4" key={index}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
