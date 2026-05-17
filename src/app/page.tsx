import React from "react";
import HeroBanner from "@/src/components/HeroBanner";
import CourseList from "@/src/components/CourseList";
import {
  HomeInfo,
  HomeCounter,
  HomeInstructors,
  HomeReviewer,
} from "@/src/components/HomeEnhancements";

export default function HomePage() {
  return (
    <main className="bg-white">
      <HeroBanner />
      <HomeInfo />
      <section className="container mt-5 py-5 text-start">
        <h3 className="fw-bold text-dark mb-4 text-uppercase border-start border-warning border-4 ps-3">
          Các khóa học mới nhất
        </h3>
        <CourseList />
      </section>
      <HomeCounter />
      <HomeInstructors />
      <HomeReviewer />
    </main>
  );
}
