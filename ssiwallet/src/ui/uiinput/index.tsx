import {
  CSSProperties,
  ChangeEventHandler,
  FocusEventHandler,
  HTMLInputTypeAttribute,
  MouseEventHandler,
  useState,
} from "react";

interface UIInputProps {
  id?: string;
  label?: string;
  name?: string;
  isRequired?: boolean;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  error?: string;
  defaultValue?: string | number | null;
  instruction?: string;
  disabled?: boolean;
  autoComplete?: string;
  min?: string;
  max?: string;
}
export default function UIInput({
  id,
  label,
  name,
  isRequired,
  placeholder,
  type,
  style,
  onClick,
  onChange,
  onBlur,
  error,
  defaultValue,
  instruction,
  disabled,
  autoComplete,
  max,
  min,
}: UIInputProps) {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((prev) => !prev);
  return (
    <div className="inputfield" style={style}>
      {label ? (
        <label htmlFor={id ? id : ""} className="inputfield-label">
          {label} {isRequired ? "*" : ""}
        </label>
      ) : null}

      <input
        type={type === "password" ? (show ? "text" : "password") : type}
        id={id}
        name={name}
        className={`inputfield-input ${error ? "error" : ""}`}
        placeholder={placeholder}
        onClick={onClick}
        onChange={onChange}
        onBlur={onBlur}
        defaultValue={defaultValue ?? ""}
        required={isRequired}
        disabled={disabled}
        autoComplete={autoComplete ?? name}
        min={min}
        max={max}
      />

      {error ? <span className="inputfield-error">{error}</span> : null}

      {type === "password" ? (
        <i
          className={`fa-regular fa-eye${show ? "" : "-slash"}`}
          onClick={toggleShow}
          style={{
            bottom: label && !error ? "35%" : !label && error ? "65%" : "50%",
          }}
        ></i>
      ) : null}

      {instruction ? (
        <p className="inputfield-instruction">{instruction}</p>
      ) : null}
    </div>
  );
}
