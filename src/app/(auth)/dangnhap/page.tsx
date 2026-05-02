"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux"; // Công cụ chạy ra quầy giao dịch Ngân hàng
import { loginSuccess } from "@/src/redux/userSlice"; // Cái hành động nộp tiền em viết hôm qua
import { authService } from "@/src/services/authService";
import Cookies from "js-cookie"; // Thợ rèn làm két sắt

export default function LoginPage() {
  // Bộ nhớ ngắn hạn lưu tài khoản và mật khẩu người dùng gõ
  const [taiKhoan, setTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");
  // Gọi người lái xe ra chờ sẵn
  const router = useRouter();
  // Gọi nhân viên ngân hàng ra chờ sẵn
  const dispatch = useDispatch();

  // Nhớ import useState nếu chưa có nhé
  const [showPassword, setShowPassword] = useState(false);

  // Hàm xử lý khi người dùng bấm nút Đăng nhập

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Chặn tải lại trang
    try {
      // 1. Gọi điện cho Bảo vệ
      const data = await authService.login(taiKhoan, matKhau);

      // Giả sử Backend trả về dữ liệu nằm trong data.content (Em nhớ log ra xem nhé)
      const userInfo = data.content ? data.content : data;

      // ------------------------------------------------------------
      // BÀI TẬP CỦA EM Ở ĐÂY (Hãy viết code cho 3 bước sau):
      // ------------------------------------------------------------

      // Bước 2: Nộp hồ sơ vào Ngân hàng Redux
      // Gợi ý: dispatch(...) cái hành động loginSuccess kèm theo biến userInfo
      dispatch(loginSuccess(userInfo)); // Nộp hồ sơ vào Ngân hàng Redux

      // Bước 3: Cất Vòng tay VIP (accessToken) vào két sắt Cookie
      // Gợi ý: Cookies.set('accessToken', userInfo.accessToken, { expires: 7 });
      // // Lưu 7 ngày
      Cookies.set("accessToken", userInfo.accessToken, { expires: 7 }); // Cất Vòng tay VIP vào két sắt Cookie, lưu 7 ngày

      // Bước 4: Bảo người lái xe (router) chở thẳng về Trang chủ ('/')
      router.push("/");

      alert("Đăng nhập thành công!"); // Báo tin vui
    } catch (error) {
      alert("Tài khoản hoặc mật khẩu không chính xác!");
    }
  };

  return (
    <main
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh", paddingTop: "100px" }}
    >
      <div className="card shadow-lg p-5 rounded-4" style={{ width: "400px" }}>
        <h2 className="text-center fw-bold mb-4">ĐĂNG NHẬP</h2>

        <form onSubmit={handleLogin}>
          {/* TÀI KHOẢN */}
          <div className="mb-3">
            <label className="form-label fw-bold">Tài khoản</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tài khoản"
              value={taiKhoan}
              onChange={(e) => setTaiKhoan(e.target.value)} // Lưu chữ đang gõ vào State
              required
            />
          </div>

          {/* MẬT KHẨU: Em hãy tự làm ô Input mật khẩu (type="password") tương tự ô Tài khoản nhé! */}
          {/* ... code của em ở đây ... */}
          <div className="mb-3">
            <label className="form-label fw-bold">Mật khẩu</label>
            <div className="input-group">
              {" "}
              {/* Bọc input vào một cái group */}
              {/* 1. Mệnh đề 3 ngôi: Nếu showPassword là true thì type="text", ngược lại type="password" */}
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Nhập mật khẩu"
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                required
              />
              {/* 2. Nút bấm để lật công tắc */}
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Nghĩa là: Đang bật thì tắt, đang tắt thì bật
              >
                {/* 3. Đổi icon FontAwesome tùy theo trạng thái */}
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
          </div>
          {/* NÚT ĐĂNG NHẬP */}
          <button type="submit" className="btn btn-warning w-100 fw-bold mt-3">
            Đăng nhập
          </button>
        </form>
      </div>
    </main>
  );
}
