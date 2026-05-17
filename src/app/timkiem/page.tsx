"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { courseService } from "@/src/services/courseService";
import { Course } from "@/src/types/Course";
import CourseCard from "@/src/components/CourseCard";

// 1. ĐỔI TÊN HÀM CŨ THÀNH SearchContent
function SearchContent() {
  const searchParams = useSearchParams();
  const tuKhoa = searchParams?.get("tuKhoa");

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      if (tuKhoa) {
        const data = await courseService.searchCourse(tuKhoa);
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
        <div className="row g-4">
          {courses.map((course, index) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 2. TẠO COMPONENT CHÍNH BỌC SUSPENSE Ở NGOÀI CÙNG
export default function SearchPage() {
  return (
    <main
      className="bg-light"
      style={{ minHeight: "80vh", paddingTop: "100px" }}
    >
      {/* Thẻ Suspense làm "phòng chờ" cho SearchContent */}
      <Suspense
        fallback={
          <div className="container mt-5 py-5 text-center">
            <div className="spinner-border text-warning" role="status"></div>
            <h4 className="mt-3">Đang tải giao diện tìm kiếm...</h4>
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </main>
  );
}
