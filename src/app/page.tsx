import Image from "next/image";
import CourseList from "../components/CourseList";

// Nằm ở file src/app/page.tsx
export default function Home() {
  return (
    <main>
      {/* Ma thuật CSS tạo hiệu ứng nhịp đập Pulse và hover cho nút Play */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .play-btn {
          transition: all 0.3s ease;
          animation: pulse 2s infinite;
        }
        .play-btn:hover {
          transform: scale(1.1) rotate(5deg); /* Thêm chút xoay khi hover cho ngầu */
          box-shadow: 0 0 40px #eab308;
          cursor: pointer;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.7); }
          70% { box-shadow: 0 0 0 25px rgba(234, 179, 8, 0); }
          100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
        }
      `,
        }}
      />

      {/* =========================================================
         1. KHỐI HERO SECTION (Cái khung để dán các lớp giấy)
         Thầy dùng position: relative và overflow: hidden
         ========================================================= */}
      <section
        suppressHydrationWarning
        className="text-white"
        style={{
          position: "relative" /* Làm cái khung để dán các lớp absolute vào */,
          minHeight: "80vh" /* Tăng chiều cao lên chút cho hoành tráng */,
          display: "flex",
          alignItems: "center",
          overflow: "hidden" /* Giấu video thừa nếu nó to quá */,
        }}
      >
        {/* ---------------------------------------------------------
           LỚP 1: VIDEO NỀN (Nằm dưới cùng - Z-index: -2)
           Thầy dùng absolute để dán nó che kín toàn bộ khung
           --------------------------------------------------------- */}
        <div
          suppressHydrationWarning
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -2,
          }}
        >
          <video
            autoPlay /* Tự động chạy */
            loop /* Chạy lặp lại liên tục */
            muted /* BẮT BUỘC tắt tiếng thì trình duyệt mới cho autoplay */
            playsInline /* Giúp chạy tốt trên cả điện thoại */
            className="w-100 h-100"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              objectFit: "cover" /* Giúp video không bị bóp méo hình */,
              zIndex: -2 /* Đẩy xuống tầng thấp nhất */,
            }}
          >
            {/* Đường dẫn tới file video em đã gửi */}
            <source src="/2759482-uhd_3840_2160_30fps.mp4" type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video nền.
          </video>
        </div>

        {/* ---------------------------------------------------------
           LỚP 2: LỚP KÍNH ĐEN MỜ (Overlay - Z-index: -1)
           Nằm đè lên video để chữ không bị lóa, dễ đọc hơn
           --------------------------------------------------------- */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.8)" /* Màu đen xanh mờ */,
            zIndex: -1 /* Nằm trên video, nằm dưới nội dung */,
          }}
        ></div>

        {/* ---------------------------------------------------------
           LỚP 3: NỘI DUNG CHÍNH (Nằm trên cùng - Z-index: default)
           (Giữ nguyên nút Play thở và khối chữ màu vàng)
           --------------------------------------------------------- */}
        <div className="container py-5" style={{ position: "relative" }}>
          <div className="row align-items-center">
            {/* Nửa bên trái: Nút Play năng lượng (Vẫn giữ nguyên) */}
            <div className="col-md-6 text-center mb-5 mb-md-0">
              <div
                className="play-btn"
                style={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  border: "3px solid #eab308",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  boxShadow: "0 0 15px #eab308",
                }}
              >
                <i
                  className="fa-solid fa-play fa-3x"
                  style={{ color: "#eab308", marginLeft: "10px" }}
                ></i>
              </div>
            </div>

            {/* Nửa bên phải: Khối chữ màu vàng (Vẫn giữ nguyên) */}
            <div className="col-md-6">
              <h1
                className="fw-bold display-3 mb-3"
                style={{
                  color: "#eab308",
                  textShadow: "2px 2px 5px rgba(0,0,0,0.8)",
                }}
              >
                KHỞI ĐẦU
                <br />
                SỰ NGHIỆP
                <br />
                CỦA BẠN
              </h1>
              <p className="fs-5 mb-4 text-light">
                Trở thành lập trình viên chuyên nghiệp tại CyberSoft với lộ
                trình chuẩn thực tế.
              </p>
              <button
                className="btn btn-warning btn-lg px-5 fw-bold shadow-sm"
                style={{ borderRadius: "30px" }}
              >
                Tư vấn học ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KHỐI DANH SÁCH KHÓA HỌC (Chuẩn bị sẵn khung để bước sau làm) */}
      <section className="container mt-5 py-5">
        <h3 className="fw-bold mb-4">Các khóa học mới nhất</h3>
        <CourseList />
      </section>
    </main>
  );
}
