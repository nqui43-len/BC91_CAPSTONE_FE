"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/redux/store"; // Import kiểu AppDispatch để TS không báo lỗi
import { loginUser } from "@/src/redux/userSlice"; // Đổi thành import loginUser (Async Thunk)

export default function LoginPage() {
  const [taiKhoan, setTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>(); // Định kiểu cho dispatch

  // HÀM XỬ LÝ ĐĂNG NHẬP MỚI (Cực kỳ Gọn Gàng)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Chỉ cần phát 1 lệnh duy nhất! Redux Thunk sẽ tự đi gọi API, tự cất Cookie, tự cập nhật State.
      // Dùng .unwrap() để bắt lỗi nếu Thunk thất bại
      await dispatch(loginUser({ taiKhoan, matKhau })).unwrap();

      // Nếu qua được dòng trên nghĩa là thành công
      router.push("/"); // Chở về Trang chủ
    } catch (error: any) {
      // Nếu có lỗi, Thunk sẽ ném câu thông báo lỗi về đây
      alert(error || "Tài khoản hoặc mật khẩu không chính xác!");
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
          {/* Ô TÀI KHOẢN */}
          <div className="mb-3">
            <label className="form-label fw-bold">Tài khoản</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tài khoản"
              value={taiKhoan}
              onChange={(e) => setTaiKhoan(e.target.value)}
              required
            />
          </div>

          {/* Ô MẬT KHẨU CÓ CÔNG TẮC CON MẮT */}
          <div className="mb-3">
            <label className="form-label fw-bold">Mật khẩu</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Nhập mật khẩu"
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                required
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
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
