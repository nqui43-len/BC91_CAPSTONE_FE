"use client";
import React, { useEffect, useState } from "react";
import { courseService } from "../services/courseService";
import { Category } from "../types/Course";
import Link from "next/link";
import { useRouter } from "next/dist/client/components/navigation";

export default function Header() {
  // Tạo 1 cái 'giỏ' rỗng để đựng danh mục
  const [categories, setCategories] = useState<Category[]>([]);
  // 1. Tạo bộ nhớ lưu từ khóa (mặc định là rỗng)
  const [keyword, setKeyword] = useState('');
  
  // 2. Gọi người lái xe ra chờ sẵn
  const router = useRouter();

  // 3. Hàm xử lý khi người dùng bấm nút Kính lúp hoặc gõ Enter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Phép thuật chặn trình duyệt tự động F5 lại trang khi submit form
    
    // Nếu người dùng có gõ chữ (không phải toàn dấu cách) thì mới cho xe chạy
    if (keyword.trim() !== '') {
      // Bảo người lái xe chở sang trang timkiem, mang theo hành lý là từ khóa
      router.push(`/timkiem?tuKhoa=${keyword}`);
    }
  };

  // Vừa load component là chạy đi lấy data ngay
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    const fetchCategories = async () => {
      const data = await courseService.getCategoryList();
      // Nhìn vào Swagger của em, dữ liệu thực sự nằm trong data.content
      if (data && data.content) {
        setCategories(data.content);
      }
    };

    fetchCategories();
  }, []); // Dấu [] ở cuối nghĩa là chỉ chạy 1 lần duy nhất khi mở trang

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm py-3"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.35)" /* Trắng hơi trong suốt */,
        backdropFilter: "blur(10px)" /* Làm nhòe phần phía sau tấm kính */,
        WebkitBackdropFilter:
          "blur(10px)" /* Hỗ trợ thêm cho trình duyệt Safari của Apple */,
      }}
    >
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand font-weight-bold" href="/">
          <img
            src="/logo.png"
            alt="E-Learning Logo"
            width={200}
            height={60}
            className="d-inline-block align-top"
          />
        </Link>

        {/* Nút hiện menu trên mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {/* Dropdown Danh Mục Khóa Học */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                Danh mục khóa học
              </a>
              <ul className="dropdown-menu">
                {/* Dùng vòng lặp map() để in từng danh mục ra */}
                {categories.map((item, index) => (
                  <li key={index}>
                    <Link
                      className="dropdown-item"
                      href={`/danhmuc/${item.maDanhMuc}`}
                    >
                      {item.tenDanhMuc}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <form className="input-group mx-auto" style={{ width: "40%" }} onSubmit={handleSearch}>
            <input
              className="form-control border-end-0"
              type="search"
              placeholder="Tìm khóa học..."
              aria-label="Search"
              // Ràng buộc giá trị ô input vào "bộ nhớ"
              value={keyword} 
              // Mỗi khi gõ 1 chữ, cập nhật chữ đó vào "bộ nhớ"
              onChange={(e) => setKeyword(e.target.value)} 
            />
            <button className="btn border border-start-0 bg-whit" type="submit">
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
            </button>
          </form>
          {/* Cụm nút Đăng ký / Đăng nhập */}
          <div className="d-flex">
            <button className="btn btn-outline-dark me-2">Đăng ký</button>
            <button className="btn btn-dark">Đăng nhập</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
