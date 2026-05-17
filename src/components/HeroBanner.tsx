export default function HeroBanner() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .play-btn {
          transition: all 0.3s ease;
          animation: pulse 2s infinite;
        }
        .play-btn:hover {
          transform: scale(1.1) rotate(5deg);
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

      {/* --- HERO SECTION CONTAINER --- */}
      <section
        suppressHydrationWarning
        className="text-white"
        style={{
          position: "relative",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* LỚP 1: BACKGROUND MEDIA LAYER */}
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
            suppressHydrationWarning
            autoPlay
            loop
            muted
            playsInline
            className="w-100 h-100"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              objectFit: "cover",
              zIndex: -2,
            }}
          >
            <source src="/2759482-uhd_3840_2160_30fps.mp4" type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video nền.
          </video>
        </div>

        {/* LỚP 2: OVERLAY MASK LAYER */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            zIndex: -1,
          }}
        ></div>

        {/* LỚP 3: MAIN CONTENT LAYER */}
        <div className="container py-5" style={{ position: "relative" }}>
          <div className="row align-items-center">
            {/* Khối Visual Action */}
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

            {/* Khối Call To Action - CTA */}
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
    </>
  );
}
