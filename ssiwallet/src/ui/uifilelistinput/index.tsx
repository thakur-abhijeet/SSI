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

interface UIFileListInputProps {
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
}
export default function UIFileListInput({
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
}: UIFileListInputProps) {
  const [fileList, setFileList] = useState<FileList | null>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files?.length < 1) return;

    const existingFilesArray = fileList ? Array.from(fileList) : [];

    const combinedFiles = existingFilesArray.concat(Array.from(files));

    const dataTransfer = new DataTransfer();
    combinedFiles.forEach((file) => dataTransfer.items.add(file));

    setFileList(dataTransfer.files);
    onChange &&
      onChange({
        target: {
          name: name ?? "File Input",
          files: dataTransfer.files,
          required: isRequired ?? false,
          type: "file",
        },
      } as ChangeEvent<HTMLInputElement>);
  };
  const handleFileDelete = (item: keyof FileList) => {
    const files = (fileList ? Array.from(fileList) : []).filter(
      (_, index) => index !== item
    );

    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));

    setFileList(dataTransfer.files);
    onChange &&
      onChange({
        target: {
          name: name ?? "File Input",
          files: dataTransfer.files,
          required: isRequired ?? false,
          type: "file",
        },
      } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="filelistinput" style={style}>
      {label ? (
        <label htmlFor={id ? id : ""} className="filelistinput-label">
          {label} {isRequired ? "*" : ""}
        </label>
      ) : null}

      <div className={`filelistinput-input ${error ? "error" : ""}`}>
        {fileList &&
          Object.values(fileList).map((item, index) => (
            <div className="filelistinput-input--image" key={index}>
              <i
                className="fa-regular fa-times"
                onClick={() => handleFileDelete(index)}
              ></i>
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
            </div>
          ))}
        {!multiple && fileList?.length === 1 ? null : (
          <div className="filelistinput-input--add">
            <i className="fa-regular fa-plus "></i>
            <span>
              {placeholder
                ? placeholder
                : fileList && fileList?.length > 0
                ? fileList?.length + " Items Selected"
                : "Drop or Click"}
            </span>
            <input
              type={"file"}
              onChange={handleFileChange}
              id={id}
              name={name}
              required={isRequired}
              multiple={multiple}
            />
          </div>
        )}
      </div>

      {error ? <span className="filelistinput-error">{error}</span> : null}

      {instruction ? (
        <p className="filelistinput-instruction">{instruction}</p>
      ) : null}
    </div>
  );
}
