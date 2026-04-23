"use client";
import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-5 mt-5 border-top border-warning border-3">
      <div className="container">
        <div className="row">
          {/* CỘT 1: Thông tin & Đăng ký khuyến mãi */}
          <div className="col-md-4 mb-4">
            <h5 className="text-warning fw-bold mb-3">CYBERSOFT</h5>
            <p className="fw-bold">NHẬN TIN SỰ KIỆN & KHUYẾN MÃI</p>
            <p className="small text-light mb-3">
              CyberSoft sẽ gởi các khóa học trực tuyến & các chương trình
              CyberLive hoàn toàn MIỄN PHÍ và các chương trình KHUYẾN MÃI hấp
              dẫn đến các bạn.
            </p>
            <form className="d-flex mb-4">
              <input
                type="email"
                className="form-control me-2 rounded-0"
                placeholder="your.email@gmail.com"
              />
              <button
                className="btn btn-warning fw-bold rounded-0"
                type="submit"
              >
                ĐĂNG KÝ
              </button>
            </form>
            <ul className="list-unstyled small text-light">
              <li className="mb-2">
                <i className="fa-solid fa-location-dot me-2 text-warning"></i>Cơ
                sở 1: 376 Võ Văn Tần - Quận 3
              </li>
              <li className="mb-2">
                <i className="fa-solid fa-location-dot me-2 text-warning"></i>Cơ
                sở 2: 459 Sư Vạn Hạnh - Quận 10
              </li>
              <li className="mb-2">
                <i className="fa-solid fa-phone me-2 text-warning"></i>
                096.105.1014 - 098.407.5835
              </li>
            </ul>
          </div>

          {/* CỘT 2: Form Đăng ký tư vấn */}
          <div className="col-md-4 mb-4">
            <h5 className="text-warning fw-bold mb-3">ĐĂNG KÍ TƯ VẤN</h5>
            <form>
              <input
                type="text"
                className="form-control mb-2 rounded-0"
                placeholder="Họ và tên *"
              />
              <input
                type="email"
                className="form-control mb-2 rounded-0"
                placeholder="Email liên hệ *"
              />
              <input
                type="tel"
                className="form-control mb-2 rounded-0"
                placeholder="Điện thoại liên hệ *"
              />

              <p className="mt-3 mb-1 small fw-bold">Nhấn vào ô bên dưới</p>
              {/* Fake khung reCAPTCHA */}
              <div className="mb-3">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Đây là chìa khóa dùng thử (Test Key) vĩnh viễn của Google
                  onChange={(value) => console.log("Đã xác minh!", value)} // Khi tick xanh xong nó sẽ báo ở đây
                />
              </div>

              <button className="btn btn-warning fw-bold text-dark rounded-0">
                Đăng ký tư vấn
              </button>
            </form>
          </div>

          {/* CỘT 3: Fanpage & Liên kết */}
          <div className="col-md-4 mb-4">
            <h5 className="text-warning fw-bold mb-3">CYBERSOFT ACADEMY</h5>
            {/* Ảnh fake Fanpage Facebook */}
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Flophocviet&tabs=&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
              width="340"
              height="130"
              style={{
                border: "none",
                overflow: "hidden",
                borderRadius: "8px",
              }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              className="mb-3 bg-white"
            ></iframe>

            {/* Chia làm 2 cột nhỏ cho các liên kết */}
            <div className="row small text-light">
              <div className="col-6">
                <ul className="list-unstyled">
                  <li className="mb-1">
                    <a href="#" className="text-decoration-none text-light">
                      Lập trình FrontEnd
                    </a>
                  </li>
                  <li className="mb-1">
                    <a href="#" className="text-decoration-none text-light">
                      Lập trình ReactJS
                    </a>
                  </li>
                  <li className="mb-1">
                    <a href="#" className="text-decoration-none text-light">
                      Lập trình VueJS
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-6">
                <ul className="list-unstyled">
                  <li className="mb-1">
                    <a href="#" className="text-decoration-none text-light">
                      Lập trình BackEnd
                    </a>
                  </li>
                  <li className="mb-1">
                    <a href="#" className="text-decoration-none text-light">
                      Lập trình NodeJS
                    </a>
                  </li>
                  <li className="mb-1">
                    <a href="#" className="text-decoration-none text-light">
                      Lập trình Java
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
