import { FILE } from "@/constants/images";
import Image from "next/image";
import {
  CSSProperties,
  ChangeEvent,
  ChangeEventHandler,
  HTMLInputTypeAttribute,
  MouseEventHandler,
  useState,
} from "react";

interface UIFileInputProps {
  id?: string;
  label?: string;
  name?: string;
  isRequired?: boolean;
  placeholder?: string;
  style?: CSSProperties;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  error?: string;
  defaultValue?: string | number | null;
  instruction?: string;
  multiple?: boolean;
  accept?: string;
}
export default function UIFileInput({
  id,
  label,
  name,
  isRequired,
  placeholder,
  style,
  onChange,
  error,
  instruction,
  multiple,
  accept,
}: UIFileInputProps) {
  const [fileList, setFileList] = useState<FileList | null>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files?.length < 1) return;
    setFileList(files);
    onChange && onChange(e);
  };

  return (
    <div className="fileinput" style={style}>
      {label ? (
        <label htmlFor={id ? id : ""} className="fileinput-label">
          {label} {isRequired ? "*" : ""}
        </label>
      ) : null}

      <div className={`fileinput-input ${error ? "error" : ""}`}>
        <div className="fileinput-wrapper">
          <div className="fileinput-input--icon">
            <i className="fa-regular fa-upload "></i>
          </div>
          <div className="fileinput-input--placeholder">
            {placeholder
              ? placeholder
              : fileList && fileList?.length > 0
              ? fileList?.length + " Items Selected"
              : "Drop or Click to upload File"}
          </div>
        </div>

        <input
          type={"file"}
          onChange={handleFileChange}
          id={id}
          name={name}
          required={isRequired}
          multiple={multiple}
          accept={accept}
        />

        {fileList && (
          <div className="fileinput-input--images">
            {Object.values(fileList).map((item, index) => (
              <Image
                key={index}
                src={
                  item.type.indexOf("image/") > -1
                    ? URL.createObjectURL(item)
                    : FILE
                }
                alt={item.name}
                width={1000}
                height={1000}
                quality={25}
              />
            ))}
          </div>
        )}
      </div>

      {error ? <span className="fileinput-error">{error}</span> : null}

      {instruction ? (
        <p className="fileinput-instruction">{instruction}</p>
      ) : null}
    </div>
  );
}
