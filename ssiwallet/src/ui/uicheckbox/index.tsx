import {
  CSSProperties,
  ChangeEvent,
  ChangeEventHandler,
  HTMLInputTypeAttribute,
  MouseEventHandler,
  useState,
} from "react";

interface UICheckboxProps {
  id?: string;
  label?: string;
  name?: string;
  isRequired?: boolean;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  error?: string;
  defaultChecked?: boolean;
  instruction?: string;
}
export default function UICheckbox({
  id,
  label,
  name,
  isRequired,
  style,
  onClick,
  onChange,
  error,
  defaultChecked = false,
  instruction,
}: UICheckboxProps) {
  return (
    <div className="checkbox" style={style}>
      <div className="checkbox-wrapper">
        <div className={`checkbox-marker ${error ? "error" : ""}`}>
          <input
            type="checkbox"
            id={id}
            name={name}
            onClick={(e) => onClick?.(e)}
            onChange={(e) => onChange?.(e)}
            checked={defaultChecked}
            required={isRequired}
          />
        </div>

        {label ? (
          <label htmlFor={id ? id : ""} className="checkbox-label">
            {label} {isRequired ? "*" : ""}
          </label>
        ) : null}
      </div>

      {error ? <span className="checkbox-error">{error}</span> : null}

      {instruction ? (
        <p className="checkbox-instruction">{instruction}</p>
      ) : null}
    </div>
  );
}
