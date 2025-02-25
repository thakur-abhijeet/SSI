import { DUMMY_PROFILE } from "@/constants/images";
import { logout } from "@/redux/slice/authSlice";
import { changeTheme, toggleMenu } from "@/redux/slice/systemSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Image from "next/image";
import { useRouter } from "next/router";
import { MouseEvent, MouseEventHandler } from "react";

interface TNavBarProps {
  name: string;
  showBars?: boolean;
  children?: JSX.Element;
  back?: () => void;
}
export default function NavBar({ name, showBars, back }: TNavBarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const systemSelector = useAppSelector((state) => state.system);

  const handleThemeToggle = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(changeTheme(systemSelector.theme === "dark" ? "light" : "dark"));
  };
  const handleLogout = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(logout());
    router.replace("/");
  };

  const handleToggleBar = (e: MouseEvent<HTMLElement>) =>
    dispatch(toggleMenu());

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-left--text">{name}</h2>
      </div>
      <div className="navbar-right">
        <div className="navbar-right">
          <div className="navbar-right--item" onClick={handleThemeToggle}>
            <i
              className={`fa-regular fa-${
                systemSelector.theme === "dark" ? "moon" : "sun-bright"
              }`}
            ></i>
          </div>
          <div
            onClick={handleLogout}
            className="navbar-right--item navbar-right--item__logout"
          >
            <i className="fa-regular fa-arrow-right-from-bracket"></i>
          </div>
          <div className="navbar-right--profile">
            <Image src={DUMMY_PROFILE} alt="User profile" />
          </div>
        </div>
      </div>
    </div>
  );
}
