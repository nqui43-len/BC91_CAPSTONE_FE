"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/redux/store";
import { loginUser } from "@/src/redux/userSlice";

export default function LoginPage() {
  const [taiKhoan, setTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Xử lý luồng đăng nhập thông qua Redux Thunk
  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Dispatch action loginUser: Tự động gọi API, lưu Token vào Cookie và cập nhật Redux State.
      // Sử dụng .unwrap() để đưa lỗi (exception) thẳng vào catch block nếu API reject.
      await dispatch(loginUser({ taiKhoan, matKhau })).unwrap();

      // Đăng nhập thành công -> Điều hướng về trang chủ
      router.push("/");
    } catch (error: any) {
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
          {/* Trường Tài khoản */}
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

          {/* Trường Mật khẩu (Tích hợp Toggle ẩn/hiện) */}
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
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-warning w-100 fw-bold mt-3">
            Đăng nhập
          </button>
        </form>
      </div>
    </main>
  );
}
