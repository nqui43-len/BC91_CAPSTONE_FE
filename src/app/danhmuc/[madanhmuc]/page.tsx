"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { courseService } from "../../../services/courseService";
import { Course } from "../../../types/Course";
import Link from "next/link";
// Em nhớ import thêm các component cần thiết nếu muốn tái sử dụng nhé
import CourseCard from "@/src/components/CourseCard";

export default function CategoryPage() {
  const params = useParams();
  const madanhmuc = params?.madanhmuc as string;

  // Khai báo state chứa mảng các khóa học (mặc định là mảng rỗng)
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (madanhmuc) {
        const data = await courseService.getCoursesByCategory(madanhmuc);

        // Kiểm tra xem backend trả về mảng ở đâu (thường là data.content)
        // và lưu vào state
        if (data && typeof data === "object") {
          // Tuỳ API, có thể data là mảng luôn hoặc nằm trong data.content
          const courseArray = Array.isArray(data) ? data : data.content || [];
          setCourses(courseArray);
        }
        setLoading(false);
      }
    };

    fetchCourses();
  }, [madanhmuc]);

  // Nếu đang gọi API thì hiện loading
  if (loading) {
    return (
      <div
        className="container mt-5 py-5 text-center"
        style={{ minHeight: "60vh", paddingTop: "100px" }}
      >
        <div className="spinner-border text-warning" role="status"></div>
        <h4 className="mt-3">Đang tải danh sách khóa học...</h4>
      </div>
    );
  }

  // BÀI TẬP CỦA EM Ở DƯỚI NÀY ĐÂY:
  return (
    <main
      className="bg-light"
      style={{ minHeight: "80vh", paddingTop: "100px" }}
    >
      <div className="container py-5">
        <h2 className="fw-bold text-uppercase mb-4 border-start border-warning border-4 ps-3">
          Khóa học thuộc danh mục:{" "}
          <span className="text-warning">{madanhmuc}</span>
        </h2>

        {courses.length === 0 ? (
          <p className="text-danger">
            Hiện tại chưa có khóa học nào trong danh mục này.
          </p>
        ) : (
          <div className="row">
            {courses.map((course, index) => (
              <div className="col-md-3 mb-4" key={index}>
                {/* 
                     THỬ THÁCH MINIGAME CHO EM:
                     Em hãy copy đoạn code vẽ cái thẻ (Card) khóa học từ trang chủ 
                     (hoặc file CourseList.tsx) và dán vào đây để hiển thị nhé!
                  */}
                  <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
