import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. Định nghĩa xem "Kho hồ sơ người dùng" có những gì
interface UserState {
  userInfo: any | null;
  isLoggedIn: boolean;
}

// 2. Trạng thái ban đầu khi vừa vào web (Chưa ai đăng nhập cả)
const initialState: UserState = {
  userInfo: null,
  isLoggedIn: false,
};

// 3. Khởi tạo Slice (Phòng ban)
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Hành động 1: Cập nhật dữ liệu khi Đăng nhập THÀNH CÔNG
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload; 
      state.isLoggedIn = true; // Bật cờ đăng nhập lên
    },

    // BÀI TẬP CỦA EM Ở ĐÂY: Hành động 2 - Đăng xuất (logout)
    logout: (state) => {
        state.userInfo = null;
        state.isLoggedIn = false;
    }
  }
});

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;