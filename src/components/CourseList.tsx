// Nằm ở file src/components/CourseList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { courseService } from "../services/courseService";
import { Course } from "../types/Course";
import CourseCard from "./CourseCard";

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
          <CourseCard course={course} />
        </div>
      ))}
    </div>
  );
}
