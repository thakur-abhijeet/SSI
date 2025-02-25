import { LOGO } from "@/constants/images";
import { useAppSelector } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { TLoginSchema } from "@/schemas/auth.schema";

const menuItems: (Omit<TMenuItemProps, "isActive"> & {
  role: TLoginSchema["role"];
})[] = [
  {
    href: "/issuer",
    title: "Credentials",
    iconName: "fa-keys",
    role: "Issuer",
  },
];

export function getLogo(theme: "light" | "dark", isOpen: boolean) {
  switch (theme) {
    default:
      return LOGO;
  }
}

export default function Sidebar() {
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);
  const systemSelector = useAppSelector((state) => state.system);

  return (
    <>
      <div
        className="sidebar"
        style={{ width: systemSelector.menu ? "15%" : "max-content" }}
      >
        <div className="sidebar-top">
          <div className="sidebar-top--logo">
            <Image
              src={getLogo(systemSelector.theme, systemSelector.menu)}
              alt="Esquare logo"
              className="sidebar-top--logo__icon"
            />
          </div>
          <ul className={`sidebar-top--menu`}>
            {menuItems.map((value, index: number) => {
              return (
                value.role === auth.role && (
                  <MenuItem
                    href={value.href}
                    title={value.title}
                    isActive={router.pathname === value.href}
                    iconName={value.iconName}
                    key={index}
                    showLabel={systemSelector.menu}
                  />
                )
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

interface TMenuItemProps {
  action?: () => void;
  href: string;
  title: string;
  iconName: string;
  isActive?: boolean;
  showLabel?: boolean;
}
const MenuItem = ({
  href,
  action,
  iconName,
  title,
  isActive,
  showLabel,
}: TMenuItemProps) => {
  return (
    <li
      className={`sidebar-top--menu__item${isActive ? " active" : ""} ${
        showLabel ? "open" : "close"
      }`}
    >
      {action ? (
        <span onClick={action} title={title} style={{ cursor: "pointer" }}>
          <i className={`fa-solid ${iconName}`}></i>
          {showLabel ? <span>{title}</span> : null}
        </span>
      ) : (
        <Link href={href} title={title}>
          <i className={`fa-solid ${iconName}`}></i>
          {showLabel ? <span>{title}</span> : null}
        </Link>
      )}
    </li>
  );
};
