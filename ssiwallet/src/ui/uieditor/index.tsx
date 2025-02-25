import JoditEditor, { Jodit } from "jodit-react";
import dynamic from "next/dynamic";
import {
  CSSProperties,
  ChangeEvent,
  ChangeEventHandler,
  useMemo,
  useRef,
} from "react";

interface UITextEditorProps {
  id: string;
  label?: string;
  name?: string;
  isRequired?: boolean;
  placeholder?: string;
  style?: CSSProperties;
  error?: string;
  defaultValue?: string | null;
  formatedEditorConfig?: {
    readonly?: boolean;
    height?: number;
    theme?: "dark" | "light";
    width?: number;
  };
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  instruction?: string;
  rows?: number;
  cols?: number;
}
export default function UITextEditor({
  id,
  error,
  isRequired,
  label,
  name,
  placeholder,
  style,
  formatedEditorConfig,
  defaultValue,
  onChange,
  instruction,
  cols,
  rows,
}: UITextEditorProps) {
  const editorRef = useRef<Jodit | null>(null);
  const config = useMemo(
    () => ({
      ...formatedEditorConfig,
      statusbar: false,
    }),
    []
  );

  return (
    <div className="texteditor" style={style}>
      {label ? (
        <label htmlFor={id ? id : ""} className="texteditor-label">
          {label} {isRequired ? "*" : ""}
        </label>
      ) : null}

      {!formatedEditorConfig ? (
        <textarea
          placeholder={placeholder}
          name={name}
          id={id}
          cols={cols ?? 30}
          rows={rows ?? 10}
          defaultValue={defaultValue ?? ""}
          className={`texteditor-input ${error ? "error" : ""}`}
          onChange={onChange}
          required={isRequired}
        ></textarea>
      ) : (
        <JoditEditor
          config={config}
          ref={editorRef}
          value={defaultValue ?? ""}
          onBlur={(e) =>
            onChange &&
            onChange({
              target: {
                name: name ?? "TextEditor",
                value: e,
                required: isRequired,
                type: "text",
              },
            } as unknown as ChangeEvent<HTMLTextAreaElement>)
          }
          className={`${error ? "error" : "normal"}`}
          onChange={(e) =>
            onChange &&
            onChange({
              target: {
                name: name ?? "TextEditor",
                value: e,
                required: isRequired,
                type: "text",
              },
            } as unknown as ChangeEvent<HTMLTextAreaElement>)
          }
        />
      )}

      {error ? <span className="texteditor-error">{error}</span> : null}

      {instruction ? (
        <p className="texteditor-instruction">{instruction}</p>
      ) : null}
    </div>
  );
}
