import {
  CSSProperties,
  ChangeEvent,
  ChangeEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  useCallback,
  useState,
} from "react";

interface UITageEditorProps {
  id?: string;
  label?: string;
  name?: string;
  isRequired?: boolean;
  placeholder?: string;
  style?: CSSProperties;
  error?: string;
  defaultValue?: string | string[];
  onChange?: ChangeEventHandler<HTMLInputElement>;
  instruction?: string;
  joinString?: string;
}
export default function UITagEditor({
  id,
  error,
  isRequired,
  label,
  name,
  placeholder,
  style,
  defaultValue,
  onChange,
  instruction,
  joinString,
}: UITageEditorProps) {
  const [state, setState] = useState<string[]>(
    defaultValue
      ? typeof defaultValue == "string"
        ? defaultValue.split(joinString ?? ",")
        : defaultValue
      : []
  );

  const [activeText, setActiveText] = useState<string>("");

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim();

    if (e.code === "Backspace" && state.length > 0 && value.length === 0) {
      const item = state[state.length - 1];
      item && setActiveText(item);
      setState((prev) => prev.slice(0, -1));
      return;
    }
    if (e.code === "Enter" && value.length > 0) {
      const tempList = [...state, value];
      setState(tempList);
      setActiveText("");
      dispatchChange(tempList);
      return;
    }
  };
  const handleRemoveItemFromState = (index: number) => {
    const tempList = state.filter((_, idx) => idx !== index);
    setState(tempList);
    dispatchChange(tempList);
  };

  const dispatchChange = useCallback(
    (val: string[]) => {
      onChange?.({
        target: {
          value: joinString ? val.join(joinString) : val,
          name: name ?? "TagEditor",
          required: isRequired ?? false,
          type: typeof defaultValue === "string" ? "text" : "list",
        },
      } as unknown as ChangeEvent<HTMLInputElement>);
    },
    [joinString, name, isRequired, defaultValue, onChange]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setActiveText(e.currentTarget.value);
  };
  const handleBlurEvent = useCallback(() => {
    if (!activeText) return;
    const tempList = [...state, activeText];
    setState(tempList);
    setActiveText("");
    dispatchChange(tempList);
  }, [activeText]);
  return (
    <div className="tageditor" style={style}>
      {label ? (
        <label htmlFor={id ? id : ""} className="tageditor-label">
          {label} {isRequired ? "*" : ""}
        </label>
      ) : null}
      <div className={`tageditor-wrapper ${error ? "error" : ""}`}>
        {state.map((item, index) => (
          <div className="tageditor-wrapper--item" key={index}>
            <span>{item}</span>
            <i
              className="fa-regular fa-times"
              onClick={() => handleRemoveItemFromState(index)}
            ></i>
          </div>
        ))}
        <input
          type="text"
          placeholder={state.length < 1 ? placeholder : ""}
          id={id}
          name={name}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onBlur={handleBlurEvent}
          value={activeText}
        />
      </div>

      {error ? <span className="tageditor-error">{error}</span> : null}
      {instruction ? (
        <p className="tageditor-instruction">{instruction}</p>
      ) : null}
    </div>
  );
}
