import Link from "next/link";
import {
  CSSProperties,
  HTMLAttributeAnchorTarget,
  MouseEventHandler,
  ReactNode,
} from "react";

type TButtonTypes = "primary" | "error" | "warning" | "success" | "secondary";
interface UIButtonProps {
  title?: string;
  id?: string;
  label?: string | ReactNode;
  style?: CSSProperties;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: TButtonTypes;
  className?: string;
  target?: HTMLAttributeAnchorTarget;
}
export default function UIButton({
  title,
  href,
  id,
  label,
  onClick,
  style,
  type,
  className,
  target,
}: UIButtonProps) {
  return href ? (
    <Link
      id={id}
      href={href}
      className={`btn btn-${type ? type : "link"}`}
      style={style}
      target={target}
      title={title}
    >
      {label}
    </Link>
  ) : (
    <button
      title={title}
      id={id}
      className={`btn btn-${type ? type : "plain"} ${
        className ? className : ""
      }`}
      style={style}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
