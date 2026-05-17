"use client";

import React, { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Hàm theo dõi vị trí cuộn chuột của người dùng
  const toggleVisibility = () => {
    // Nếu cuộn xuống quá 300px thì hiện nút, ngược lại thì ẩn
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Hàm kích hoạt cuộn mượt mà lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Lắng nghe sự kiện scroll khi Component được render
    window.addEventListener("scroll", toggleVisibility);

    // Dọn dẹp sự kiện khi Component bị hủy (Best practice trong React)
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="btn btn-warning shadow-lg border border-2 border-white"
          style={{
            position: "fixed",
            bottom: "40px", // Cách đáy 40px
            right: "40px", // Cách lề phải 40px
            zIndex: 9999, // Nổi lên trên tất cả mọi thứ
            borderRadius: "50%",
            width: "55px",
            height: "55px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease-in-out",
            opacity: 0.9,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.9")}
          title="Lên đầu trang"
        >
          <i className="fa-solid fa-arrow-up fs-4 text-dark"></i>
        </button>
      )}
    </>
  );
}
