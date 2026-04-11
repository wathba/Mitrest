import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  getCurrentUser,
  checkAuth,
} from "../api/account-api";

interface User {
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
}

interface AccountState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// ✅ LOGIN
export const loginUser = createAsyncThunk(
  "account/login",
  async (data: { email: string; password: string }, thunkAPI) => {
    try {
      await login(data.email, data.password);

      const user = await getCurrentUser();

      return user;
    } catch (err: any) {
         console.error("🔥 LOGIN ERROR:", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ✅ REGISTER
export const registerUser = createAsyncThunk(
  "account/register",
  async (data: { email: string; password: string,firstName:string,lastName:string }, thunkAPI) => {
    try {
      await register(data.email, data.password,data.firstName,data.lastName);
      return true;
    } catch {
      return thunkAPI.rejectWithValue("Register failed");
    }
  }
);

// ✅ CHECK AUTH (on app load)
export const fetchCurrentUser = createAsyncThunk(
  "account/currentUser",
  async (_, thunkAPI) => {
    try {
      const res = await checkAuth();

      if (!res) return null;

      const user = await getCurrentUser();

      return user;
    } catch {
      return null;
    }
  }
);

// ✅ LOGOUT
export const logoutUser = createAsyncThunk(
  "account/logout",
  async () => {
    await logout();
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // 🔹 LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
        state.error = "Login failed";
      })

      // 🔹 REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
        state.error = "Register failed";
      })

      // 🔹 CHECK AUTH
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })

      // 🔹 LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default accountSlice.reducer;