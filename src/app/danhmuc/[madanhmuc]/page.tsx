"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { courseService } from "../../../services/courseService";
import { Course } from "../../../types/Course";
import CourseCard from "@/src/components/CourseCard";

export default function CategoryPage() {
  // Trích xuất mã danh mục (Dynamic Route Parameter) từ thanh URL thông qua App Router Params
  const params = useParams();
  const madanhmuc = params?.madanhmuc as string;

  // Khởi tạo trạng thái dữ liệu danh sách khóa học và trạng thái tải trang (Loading state)
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!madanhmuc) return;

      try {
        const data = await courseService.getCoursesByCategory(madanhmuc);

        // Bóc tách dữ liệu an toàn: Xử lý cả trường hợp API trả về mảng trực tiếp hoặc lồng trong data.content
        if (data && typeof data === "object") {
          const courseArray = Array.isArray(data) ? data : data.content || [];
          setCourses(courseArray);
        }
      } catch (error) {
        console.log("Lỗi tải danh sách khóa học theo danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [madanhmuc]);

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

  return (
    <main
      className="bg-light"
      style={{ minHeight: "80vh", paddingTop: "100px" }}
    >
      <div className="container py-5">
        {/* Tiêu đề danh mục khóa học hiện tại */}
        <h2 className="fw-bold text-uppercase mb-4 border-start border-warning border-4 ps-3 text-start">
          Khóa học thuộc danh mục:{" "}
          <span className="text-warning">{madanhmuc}</span>
        </h2>

        {/* Luồng xử lý giao diện dựa trên số lượng phần tử mảng (Conditional Rendering) */}
        {courses.length === 0 ? (
          <div
            className="alert alert-warning text-start rounded-3 border-0 shadow-sm"
            role="alert"
          >
            <i className="fa-solid fa-circle-info me-2"></i> Hiện tại chưa có
            khóa học nào trong danh mục này. Bạn vui lòng quay lại sau nhé!
          </div>
        ) : (
          <div className="row">
            {courses.map((course, index) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                key={index}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
