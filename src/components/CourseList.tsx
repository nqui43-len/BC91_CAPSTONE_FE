// Nằm ở file src/components/CourseList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { courseService } from "../services/courseService";
import { Course } from "../types/Course";

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await courseService.getCourseList();
      if (data && data.content) {
        setCourses(data.content.slice(0, 8));
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="row g-4">
      {courses.map((course, index) => (
        <div className="col-md-3" key={index}>
          <div
            className="card h-100 shadow-sm border-0"
            style={{ transition: "transform 0.3s" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            {/* Ảnh khóa học */}
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

              <button className="btn btn-outline-warning mt-auto fw-bold text-dark w-100">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
