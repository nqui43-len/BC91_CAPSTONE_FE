"use client";

import React, { useEffect, useState, useRef } from "react";

// ==========================================
// 1. HIỆU ỨNG NHẢY SỐ (CÓ THÊM "MẮT THẦN" QUAN SÁT SCROLL)
// ==========================================
const AnimatedCounter = ({
  end,
  duration = 2000,
}: {
  end: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false); // Trạng thái kiểm tra đã bắt đầu đếm chưa
  const counterRef = useRef<HTMLSpanElement>(null); // Điểm đánh dấu để quan sát

  // Mắt thần: Canh lúc người dùng cuộn tới nơi mới cho phép bắt đầu
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true); // Kích hoạt đếm
        }
      },
      { threshold: 0.5 }, // Khi phần tử hiện ra ít nhất 50% trên màn hình
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) observer.unobserve(counterRef.current);
    };
  }, [hasStarted]);

  // Logic đếm số (Chỉ chạy khi hasStarted = true)
  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, hasStarted]);

  return <span ref={counterRef}>{count}</span>;
};

// ==========================================
// 1. KHỐI INFO (MÀU XANH / VÀNG / XÁM)
// ==========================================
export function HomeInfo() {
  return (
    <section className="container py-5">
      <div className="row g-4 text-start">
        <div className="col-lg-4 col-md-6">
          <div
            className="p-4 rounded-3 h-100 text-white"
            style={{ backgroundColor: "#41b294" }}
          >
            <h4
              className="fw-bold text-uppercase mb-3"
              style={{ fontSize: "1.3rem" }}
            >
              Khóa học
            </h4>
            <p className="fw-medium small">
              Học qua dự án thực tế, học đi đôi với hành, không lý thuyết lan
              man, phân tích cội nguồn của vấn đề, xây dựng từ các ví dụ nhỏ đến
              thực thi một dự án lớn ngoài thực tế để học viên học xong làm được
              ngay
            </p>
            <ul className="list-unstyled mt-3 lh-lg small">
              <li>
                <i className="fa-solid fa-check me-2"></i>Hơn 1000 bài tập và dự
                án thực tế
              </li>
              <li>
                <i className="fa-solid fa-check me-2"></i>Công nghệ cập nhật mới
                nhất
              </li>
              <li>
                <i className="fa-solid fa-check me-2"></i>Hình ảnh, ví dụ, bài
                giảng sinh động trực quan
              </li>
              <li>
                <i className="fa-solid fa-check me-2"></i>Tư duy phân tích, giải
                quyết vấn đề trong dự án
              </li>
              <li>
                <i className="fa-solid fa-check me-2"></i>Cơ hội thực tập tại
                các công ty lớn như FPT, Microsoft
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 d-flex flex-column gap-4">
          <div
            className="p-4 rounded-3 text-white flex-grow-1"
            style={{ backgroundColor: "#f5c00b" }}
          >
            <h4
              className="fw-bold text-uppercase mb-3"
              style={{ fontSize: "1.3rem" }}
            >
              Lộ trình phù hợp
            </h4>
            <ul className="list-unstyled lh-lg mb-0 small">
              <li>
                <i className="fa-solid fa-check me-2"></i>Lộ trình bài bản từ
                zero tới chuyên nghiệp, nâng cao
              </li>
              <li>
                <i className="fa-solid fa-check me-2"></i>Học, luyện tập code,
                kỹ thuật phân tích, soft skill
              </li>
              <li>
                <i className="fa-solid fa-check me-2"></i>Huấn luyện để phát
                triển năng lực và niềm đam mê lập trình
              </li>
            </ul>
          </div>
          <div
            className="p-4 rounded-3 text-white flex-grow-1"
            style={{ backgroundColor: "#f5c00b" }}
          >
            <h4
              className="fw-bold text-uppercase mb-3"
              style={{ fontSize: "1.3rem" }}
            >
              Giảng viên
            </h4>
            <ul className="list-unstyled lh-lg mb-0 small">
              <li>
                <i className="fa-solid fa-check me-2"></i>Tương tác cùng mentor
                và giảng viên qua phần thảo luận
              </li>
              <li>
                <i className="fa-solid fa-check me-2"></i>Review code và đưa ra
                các nhận xét xét góp ý
              </li>
              <li>
                <i className="fa-solid fa-check me-2"></i>Chấm điểm tương tác
                thảo luận giữa các học viên
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 d-flex flex-column gap-4">
          <div
            className="p-4 rounded-3 text-white flex-grow-1"
            style={{ backgroundColor: "#5c8295" }}
          >
            <h4
              className="fw-bold text-uppercase mb-3"
              style={{ fontSize: "1.3rem" }}
            >
              Hệ thống học tập
            </h4>
            <ul className="list-unstyled lh-lg mb-0 small">
              <li>
                <i className="fa-solid fa-check me-2"></i>Tự động chấm điểm trắc
                nghiệm và đưa câu hỏi tùy theo mức độ học viên
              </li>
              <li>
                <i className="fa-solid fa-check me-2"></i>Thống kê lượt xem
                video, làm bài, điểm số theo chu kỳ
              </li>
              <li>
                <i className="fa-solid fa-check me-2"></i>Thống kê, so sánh khả
                năng học của các học viên cùng level để đưa ra mục tiêu học tập
              </li>
            </ul>
          </div>
          <div
            className="p-4 rounded-3 text-white flex-grow-1"
            style={{ backgroundColor: "#65c9a0" }}
          >
            <h4
              className="fw-bold text-uppercase mb-3"
              style={{ fontSize: "1.3rem" }}
            >
              Chứng nhận
            </h4>
            <ul className="list-unstyled lh-lg mb-0 small">
              <li>
                <i className="fa-solid fa-check me-2"></i>Chấm bài và có thể vấn
                đáp trực tuyến để review
              </li>
              <li>
                <i className="fa-solid fa-check me-2"></i>Hệ thống của chúng tôi
                cũng tạo ra cho bạn một CV trực tuyến độc đáo
              </li>
              <li>
                <i className="fa-solid fa-check me-2"></i>Kết nối CV của bạn đến
                các đối tác của V-learning
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 2. KHỐI COUNT NUMBER (ĐÃ THAY ẢNH LỖI BẰNG ICON XỊN SÒ)
// ==========================================
export function HomeCounter() {
  return (
    <section className="bg-light py-5 border-top border-bottom">
      <div className="container">
        <div className="row text-center g-4">
          <div className="col-6 col-md-3">
            <div className="mb-3">
              <i
                className="fa-solid fa-users text-warning"
                style={{ fontSize: "3.5rem" }}
              ></i>
            </div>
            <h2 className="fw-bold text-success fs-1">
              <AnimatedCounter end={8677} />
            </h2>
            <p className="fw-bold text-dark mb-0">Học viên</p>
          </div>
          <div className="col-6 col-md-3">
            <div className="mb-3">
              <i
                className="fa-solid fa-book-open text-warning"
                style={{ fontSize: "3.5rem" }}
              ></i>
            </div>
            <h2 className="fw-bold text-success fs-1">
              <AnimatedCounter end={677} />
            </h2>
            <p className="fw-bold text-dark mb-0">Khóa học</p>
          </div>
          <div className="col-6 col-md-3">
            <div className="mb-3">
              <i
                className="fa-solid fa-hourglass-half text-warning"
                style={{ fontSize: "3.5rem" }}
              ></i>
            </div>
            <h2 className="fw-bold text-success fs-1">
              <AnimatedCounter end={32877} />
            </h2>
            <p className="fw-bold text-dark mb-0">Giờ học</p>
          </div>
          <div className="col-6 col-md-3">
            <div className="mb-3">
              <i
                className="fa-solid fa-chalkboard-user text-warning"
                style={{ fontSize: "3.5rem" }}
              ></i>
            </div>
            <h2 className="fw-bold text-success fs-1">
              <AnimatedCounter end={207} />
            </h2>
            <p className="fw-bold text-dark mb-0">Giảng viên</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 3. KHỐI INSTRUCTORS (GIẢNG VIÊN HÀNG ĐẦU)
// ==========================================
export function HomeInstructors() {
  return (
    <section className="container py-5 text-start">
      <h4 className="fw-bold text-dark mb-4 text-uppercase border-start border-warning border-4 ps-3">
        Giảng viên hàng đầu
      </h4>
      <div className="row text-center g-4">
        {[
          {
            name: "Big DadMoon",
            role: "Chuyên gia lĩnh vực lập trình",
            img: "https://i.pravatar.cc/150?img=11",
          },
          {
            name: "IcarDi MenBor",
            role: "Chuyên gia ngôn ngữ Vue Js",
            img: "https://i.pravatar.cc/150?img=12",
          },
          {
            name: "Bladin Slaham",
            role: "Chuyên gia hệ thống máy tính",
            img: "https://i.pravatar.cc/150?img=13",
          },
          {
            name: "Chris Andersan",
            role: "Chuyên gia lĩnh vực Full Skill",
            img: "https://i.pravatar.cc/150?img=14",
          },
          {
            name: "VueLo Gadi",
            role: "Chuyên gia lĩnh vực Phân tích",
            img: "https://i.pravatar.cc/150?img=15",
          },
          {
            name: "Hoàng Nam",
            role: "Chuyên gia lĩnh vực PHP",
            img: "https://i.pravatar.cc/150?img=68",
          },
        ].map((instructor, idx) => (
          <div className="col-6 col-md-4 col-lg-2" key={idx}>
            <div className="card border-0 h-100 shadow-sm p-3 bg-white rounded-3">
              <img
                src={instructor.img}
                alt={instructor.name}
                className="rounded-circle mb-3 mx-auto shadow-sm border border-3 border-light"
                style={{ width: "85px", height: "85px", objectFit: "cover" }}
              />
              <h6 className="fw-bold text-dark mb-1 text-truncate">
                {instructor.name}
              </h6>
              <p
                className="text-muted small mb-2 text-truncate"
                style={{ fontSize: "0.75rem" }}
              >
                {instructor.role}
              </p>
              <div className="text-warning small mb-1">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star-half-stroke"></i>{" "}
                <span
                  className="text-dark fw-bold ms-1"
                  style={{ fontSize: "0.8rem" }}
                >
                  4.9
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ==========================================
// 4. KHỐI REVIEWER (Ý KIẾN HỌC VIÊN)
// ==========================================
export function HomeReviewer() {
  return (
    <section className="container py-5 mb-5 border-top text-start">
      <div className="row align-items-center">
        <div className="col-md-5 text-center mb-4 mb-md-0 position-relative">
          <div
            className="position-absolute top-50 start-50 translate-middle bg-warning bg-opacity-10 rounded-circle animate-pulse"
            style={{ width: "265px", height: "265px", zIndex: 0 }}
          ></div>
          <img
            src="https://demo2.cybersoft.edu.vn/static/media/avatarReview.2f5a1f3c.png"
            alt="Reviewer"
            className="img-fluid position-relative"
            style={{ zIndex: 1, maxWidth: "230px" }}
          />
        </div>
        <div className="col-md-7 ps-md-4">
          <div className="position-relative p-4 bg-light rounded-4 shadow-sm">
            <i className="fa-solid fa-quote-left fa-3x text-warning opacity-25 position-absolute top-0 start-0 translate-middle ms-4 mt-2"></i>
            <p
              className="fs-6 text-dark lh-lg fst-italic mb-0"
              style={{ textAlign: "justify" }}
            >
              "Chương trình giảng dạy được biên soạn dành riêng cho các bạn Lập
              trình từ trái ngành, hoặc đã có kiến thức theo cường độ cao, luôn
              được tinh chỉnh và tối ưu hóa theo thời gian bởi các thành viên
              sáng lập và giảng viên dày kinh nghiệm. Thực sự rất hay và hấp
              dẫn."
            </p>
            <div className="mt-3 border-top pt-2">
              <h6
                className="fw-bold text-warning mb-0"
                style={{ fontSize: "1.05rem" }}
              >
                Nhi Dev
              </h6>
              <p className="text-muted small mb-0">Học viên xuất sắc</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
