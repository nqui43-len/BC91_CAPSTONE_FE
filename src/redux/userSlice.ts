import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { userService, UserProfile } from "@/src/services/userService";
import { authService } from "@/src/services/authService";
import Cookies from "js-cookie";

// --- 1. ĐỊNH NGHĨA GIAO DIỆN TRẠNG THÁI (State Interface) ---
interface UserState {
  userInfo: UserProfile | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

// --- 2. KHỞI TẠO TRẠNG THÁI MẶC ĐỊNH (Initial State) ---
const initialState: UserState = {
  userInfo: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

// --- 3. XỬ LÝ BẤT ĐỒNG BỘ (Async Thunks / Side Effects) ---

// Thunk: Đồng bộ hóa Hồ sơ người dùng từ Backend (Fetch User Profile)
export const fetchProfile = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>("user/fetchProfile", async (_, thunkAPI) => {
  try {
    const data = await userService.getProfile();
    return data;
  } catch (error: any) {
    // Trích xuất an toàn thông báo lỗi từ phía Server (Error Payload Extraction)
    const message =
      error.response?.data?.content ||
      error.response?.data?.message ||
      "Lỗi khi lấy thông tin cá nhân";

    return thunkAPI.rejectWithValue(message);
  }
});

// Thunk: Xử lý luồng Đăng nhập và Khởi tạo phiên làm việc (Authentication Flow)
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

      // Lưu trữ Token vào Cookie để duy trì phiên làm việc (Session Persistence)
      const token = payload.accessToken;
      if (token) {
        Cookies.set("accessToken", token, { expires: 7 });
      }

      // Kích hoạt Thunk fetchProfile để đồng bộ hóa ngay lập tức dữ liệu hồ sơ chi tiết (Data Hydration)
      await thunkAPI.dispatch(fetchProfile()).unwrap();

      return payload;
    } catch (error: any) {
      const message =
        error.response?.data?.content ||
        error.response?.data?.message ||
        "Sai thông tin tài khoản hoặc mật khẩu!";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// --- 4. KHỞI TẠO SLICE (Redux Slice Initialization) ---
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Synchronous Reducers: Các thao tác thay đổi State đồng bộ cục bộ
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userInfo = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    // Asynchronous Lifecycle Handling: Lắng nghe và xử lý các vòng đời của Promise (Pending, Fulfilled, Rejected)
    builder
      // Vòng đời của fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Vòng đời của loginUser
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isLoggedIn = true;
        // Ghi chú: Không cần cập nhật state.userInfo tại đây do fetchProfile đã đảm nhiệm việc Hydrate dữ liệu
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Xuất khẩu Actions và Reducer
export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
