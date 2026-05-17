"use client";

import React, { useState, useEffect } from "react";

// --- FLOATING ACTION BUTTON (FAB) CỦA HỆ THỐNG ---
export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

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
            bottom: "40px",
            right: "40px",
            zIndex: 9999,
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
