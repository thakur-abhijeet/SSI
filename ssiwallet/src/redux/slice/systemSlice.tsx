import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SystemState = {
  purchase: boolean;
  menu: boolean;
  theme: "light" | "dark";
};

const initialState: SystemState = {
  purchase: false,
  menu: true,
  theme:
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
};

const systemSlice = createSlice({
  name: "System",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.menu = !state.menu;
    },
    changeTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    createPurchase: (state, action: PayloadAction<boolean>) => {
      state.purchase = action.payload;
    },
  },
});

export const { toggleMenu, changeTheme, createPurchase } = systemSlice.actions;
export default systemSlice.reducer;
