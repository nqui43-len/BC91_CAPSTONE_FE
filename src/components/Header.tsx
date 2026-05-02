"use client";
import React, { useEffect, useState } from "react";
import { courseService } from "../services/courseService";
import { Category } from "../types/Course";
import Link from "next/link";
import { useRouter } from "next/dist/client/components/navigation";
// 1. Import công cụ của Redux và Cookie
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/redux/store"; // Nhớ kiểm tra lại đường dẫn file store.ts của em nhé
import { logout } from "@/src/redux/userSlice";
import Cookies from "js-cookie";

export default function Header() {
  // Tạo 1 cái 'giỏ' rỗng để đựng danh mục
  const [categories, setCategories] = useState<Category[]>([]);
  // 1. Tạo bộ nhớ lưu từ khóa (mặc định là rỗng)
  const [keyword, setKeyword] = useState("");

  // 2. Gọi người lái xe ra chờ sẵn
  const router = useRouter();

  // 3. Gọi nhân viên ngân hàng ra chờ sẵn
  const { userInfo, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch();

  // 3. Hàm xử lý khi người dùng bấm nút Kính lúp hoặc gõ Enter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Phép thuật chặn trình duyệt tự động F5 lại trang khi submit form

    // Nếu người dùng có gõ chữ (không phải toàn dấu cách) thì mới cho xe chạy
    if (keyword.trim() !== "") {
      // Bảo người lái xe chở sang trang timkiem, mang theo hành lý là từ khóa
      router.push(`/timkiem?tuKhoa=${keyword}`);
    }
  };

  // 3. Hàm xử lý Đăng xuất
  const handleLogout = () => {
    // BÀI TẬP CỦA EM Ở ĐÂY:
    // Yêu cầu 1: Báo cho Ngân hàng biết là tôi muốn đăng xuất (Gợi ý: dispatch cái hành động logout)
    dispatch(logout());
    // Yêu cầu 2: Mở két sắt (Cookies) và vứt cái vòng tay VIP đi.
    // Gợi ý: Dùng Cookies.remove('tên_cái_chìa_khóa_em_lưu_hôm_trước')
    Cookies.remove("accessToken");
    // Yêu cầu 3: Bảo người lái xe chở về Trang chủ ('/')
    router.push("/");
    // Yêu cầu 4: Báo tin vui cho người dùng biết là đã đăng xuất thành công
    alert("Đã đăng xuất thành công!");
  };

  // 1. Lấy tên hiện thị và cắt chữ cái đầu tiên
  const tenHienThi = userInfo?.taiKhoan || userInfo?.hoTen || "Bạn";
  const chuCaiDau = tenHienThi.charAt(0).toUpperCase(); // Biến 'admin' thành 'A'

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
          <form
            className="input-group mx-auto"
            style={{ width: "40%" }}
            onSubmit={handleSearch}
          >
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
          {/* Phần UI bên phải (Khu vực Đăng nhập) */}
          <div className="d-flex align-items-center">
            {/* 4. Ma thuật thay đổi giao diện ở đây */}
            {isLoggedIn ? (
              // NẾU ĐÃ ĐĂNG NHẬP: Hiện tên và nút Đăng xuất
              <div className="d-flex align-items-center gap-3">
                {/* 2. Render ra giao diện (Thầy dùng Bootstrap để vo tròn và căn giữa)*/}
                {/* Khối Avatar tròn */}
                <div
                  className="rounded-circle bg-warning text-dark d-flex justify-content-center align-items-center fw-bold shadow-sm"
                  style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}
                >
                  {chuCaiDau}
                </div>

                {/* Tên người dùng và Nút đăng xuất */}
                <span className="fw-bold text-dark">Chào, {tenHienThi}!</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              // NẾU CHƯA ĐĂNG NHẬP: Hiện nút Đăng nhập như cũ
              <Link href="/dangnhap" className="btn btn-dark">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
