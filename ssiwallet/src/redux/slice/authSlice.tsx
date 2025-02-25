import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { login } from "@/redux/thunks/authThunk";
import { TLoginSchema } from "@/schemas/auth.schema";

export type AuthState = {
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  role: TLoginSchema["role"] | null;
  id: string | null;
};

const initialState: AuthState = {
  error: null,
  isLoggedIn: false,
  loading: false,
  token: null,
  role: null,
  id: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.error = null;
      state.loading = false;
      state.isLoggedIn = false;
      state.token = null;
      state.role = null;
      state.id = null;
    },
    rehydrateAuth: (state, action: PayloadAction<AuthState>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.error = action.payload.error;
      state.role = action.payload.role;
      state.id = action.payload.id;
      state.loading = action.payload.loading;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state: AuthState) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.id = action.payload.id;
        state.error = null;
      })
      .addCase(login.rejected, (state: AuthState) => {
        state.error = "Something went wrong";
        state.loading = false;
        state.isLoggedIn = false;
        state.token = null;
        state.role = null;
        state.id = null;
      });
  },
});

export const { logout, rehydrateAuth, setLoading } = authSlice.actions;
export default authSlice.reducer;
