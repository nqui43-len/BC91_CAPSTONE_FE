"use client";
import React, { useEffect, useState } from "react";
import { courseService } from "../services/courseService";
import { Category } from "../types/Course";
import Link from "next/link";
import { useRouter } from "next/dist/client/components/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/src/redux/store";
import { fetchProfile, logout } from "@/src/redux/userSlice";
import Cookies from "js-cookie";

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const { userInfo, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim() !== "") {
      router.push(`/timkiem?tuKhoa=${keyword}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("accessToken");
    router.push("/");
    alert("Đã đăng xuất thành công!");
  };

  const tenHienThi = userInfo?.taiKhoan || userInfo?.hoTen || "Bạn";
  const chuCaiDau = tenHienThi.charAt(0).toUpperCase();

  // KHỐI 1: BÙA PHỤC HỒI TRÍ NHỚ REDUX (Giữ nguyên)
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token && !userInfo) {
      dispatch(fetchProfile());
    }
  }, [dispatch, userInfo]);

  // -------------------------------------------------------------
  // KHỐI 2: KÍCH HOẠT BOOTSTRAP JS & LẤY DANH MỤC KHÓA HỌC
  // -------------------------------------------------------------
  useEffect(() => {
    // 1. KÍCH HOẠT HIỆU ỨNG ĐỘNG (Dropdown, Modal) CỦA BOOTSTRAP TRÊN TRÌNH DUYỆT
    import("bootstrap/dist/js/bootstrap.bundle.min.js" as any);

    const fetchCategories = async () => {
      try {
        const data = await courseService.getCategoryList();

        // Dòng này giúp em kiểm tra xem API trả về hình dáng như thế nào ở tab Console F12
        console.log("Dữ liệu danh mục nhận được từ API:", data);

        // Bóc hộp an toàn theo cấu trúc API CyberSoft
        const categoryArray = data?.content || data || [];

        setCategories(categoryArray);
      } catch (error) {
        console.log("Lỗi tải danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm py-3"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.35)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
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
                className="nav-link dropdown-toggle fw-bold text-dark"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Danh mục khóa học
              </a>
              <ul
                className="dropdown-menu shadow-sm border-0 rounded-3"
                aria-labelledby="navbarDropdown"
              >
                {categories && categories.length > 0 ? (
                  categories.map((item, index) => (
                    <li key={index}>
                      <Link
                        className="dropdown-item py-2"
                        href={`/danhmuc/${item.maDanhMuc}`}
                      >
                        {item.tenDanhMuc}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="dropdown-item text-muted py-2">
                      Đang tải danh mục...
                    </span>
                  </li>
                )}
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
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              className="btn border border-start-0 bg-white"
              type="submit"
            >
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
            </button>
          </form>

          {/* Khu vực Đăng nhập/Đăng xuất */}
          <div className="d-flex align-items-center ms-3">
            {isLoggedIn ? (
              <div
                className="d-flex align-items-center gap-3"
                onClick={() => router.push("/thongtin")}
                style={{ cursor: "pointer" }}
                title="Vào trang Thông tin cá nhân"
              >
                <div
                  className="rounded-circle bg-warning text-dark d-flex justify-content-center align-items-center fw-bold shadow-sm"
                  style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}
                >
                  {chuCaiDau}
                </div>

                <span className="fw-bold text-dark">Chào, {tenHienThi}!</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                  className="btn btn-outline-danger btn-sm"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
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
