import Image from "next/image";
import CourseList from "../components/CourseList";
import HeroBanner from "../components/HeroBanner";
import { HomeInfo, HomeCounter, HomeInstructors, HomeReviewer } from "@/src/components/HomeEnhancements";

// Nằm ở file src/app/page.tsx
export default function Home() {
  return (
    <main>
      <HeroBanner />
      <HomeInfo />
      {/* 2. KHỐI DANH SÁCH KHÓA HỌC (Chuẩn bị sẵn khung để bước sau làm) */}
      <section className="container mt-5 py-5">
        <h3 className="fw-bold mb-4">Các khóa học mới nhất</h3>
        <CourseList />
      </section>
      <HomeCounter />
      <HomeInstructors />
      <HomeReviewer />
    </main>
  );
}
