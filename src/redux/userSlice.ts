import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { userService, UserProfile } from "@/src/services/userService"; // Import Service và Type
import { authService } from "@/src/services/authService"; // Import Service Đăng nhập
import Cookies from "js-cookie";

// 1. Cập nhật Hợp đồng State
interface UserState {
  userInfo: UserProfile | null; // Cập nhật Type ở đây thay vì 'any'
  isLoggedIn: boolean;
  loading: boolean; // MỚI: Cờ báo hiệu đang tải
  error: string | null; // MỚI: Chứa câu thông báo lỗi
}

const initialState: UserState = {
  userInfo: null,
  isLoggedIn: false, // BẮT BUỘC để false, chúng ta sẽ cho Header tự đi kiểm tra Cookie sau
  loading: false,
  error: null,
};

// 3. Khởi tạo Slice (Phòng ban)
const userSlice = createSlice({
  name: "user",
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
    },
  },
  // MỚI: Lắng nghe tiến độ của anh nhân viên fetchProfile
  extraReducers: (builder) => {
    builder
      // Trạng thái 1: Đang xách xe đi lấy dữ liệu
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Trạng thái 2: Lấy THÀNH CÔNG (payload chính là UserProfile)
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload; // Đắp dữ liệu mới tinh vào kho
        state.isLoggedIn = true;
      })
      // Trạng thái 3: Bị lỗi hoặc Token hết hạn (payload là cái chuỗi message ở trên)
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // KHI ĐĂNG NHẬP THÀNH CÔNG
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isLoggedIn = true;
        // KHÔNG CẦN gán state.userInfo ở đây nữa! 
        // Vì thằng fetchProfile được gọi ké ở trên đã tự động gán hồ sơ chuẩn 100% vào kho rồi!
      })
      // KHI ĐĂNG NHẬP THẤT BẠI
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// TẠO ASYNC THUNK: Nhân viên chuyên đi lấy Hồ sơ
export const fetchProfile = createAsyncThunk<
  UserProfile, // Kiểu dữ liệu trả về nếu THÀNH CÔNG
  void, // Tham số truyền vào khi gọi hàm (ở đây không cần truyền gì nên để void)
  { rejectValue: string } // Kiểu dữ liệu trả về nếu THẤT BẠI
>("user/fetchProfile", async (_, thunkAPI) => {
  try {
    // Nhờ chuyên viên Service gọi API (Không cần try catch bên service nữa)
    const data = await userService.getProfile();
    return data; // Trả về cho Redux cập nhật state
  } catch (error: any) {
    // GIẢI QUYẾT CÂU HỎI 1 CỦA EM TẠI ĐÂY:
    // Bóc tách đối tượng AxiosError để lấy đúng câu thông báo của Backend
    const message =
      error.response?.data?.content ||
      error.response?.data?.message ||
      "Lỗi khi lấy thông tin cá nhân";

    // Dùng công cụ của Redux để ném lỗi có kiểm soát
    return thunkAPI.rejectWithValue(message);
  }
});

// TẠO ASYNC THUNK: Nhân viên chuyên đi Đăng nhập
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials: any, thunkAPI) => {
    try {
      const response = await authService.login(
        credentials.taiKhoan,
        credentials.matKhau,
      );

      const data = response.data || response;
      const payload = data.content || data;

      const token = payload.accessToken;
      if (token) {
        Cookies.set("accessToken", token, { expires: 7 });
      }

      // TUYỆT CHIÊU: Vừa có Token xong, gọi ngay nhân viên fetchProfile đi lấy hồ sơ xịn về!
      await thunkAPI.dispatch(fetchProfile()).unwrap();

      return payload;
    } catch (error: any) {
      const message =
        error.response?.data?.content ||
        error.response?.data?.message ||
        "Sai thông tin!";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
