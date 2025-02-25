import { SystemState, changeTheme } from "@/redux/slice/systemSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

interface TThemeProps {
  children: ReactNode;
}
export default function Theme({ children }: TThemeProps) {
  const system = useAppSelector((state) => state.system);
  const dispatch = useAppDispatch();

  const theme = window.matchMedia("(prefers-color-scheme: dark)");

  theme.onchange = (e) => dispatch(changeTheme(e.matches ? "dark" : "light"));

  return <div className={`theme-wrapper ${system.theme}`}>{children}</div>;
}
