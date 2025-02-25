import { CSSProperties, ReactNode, useRef } from "react";

interface UIModalProps {
  children?: ReactNode;
  onClose?: () => void;
  style?: CSSProperties;
  showAnimation?: boolean;
}

export default function UIModal({
  children,
  onClose,
  style,
  showAnimation,
}: UIModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const handleCancel = () => {
    if (!showAnimation) return onClose?.();

    modalRef.current?.classList.add("hide");
    setTimeout(() => onClose?.(), 700);
  };
  return (
    <div className="uimodal">
      <div className="uimodal-overlay"></div>
      <div className="uimodal-content" style={style} ref={modalRef}>
        <div className="uimodal-content--cross" onClick={handleCancel}>
          <i className="fa-regular fa-times"></i>
        </div>
        {children}
      </div>
    </div>
  );
}
