import React, {
  CSSProperties,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export interface UISelectOptionEvent {
  target: {
    name: string;
    value: string;
    required: boolean;
    type: "text";
  };
}
export interface UISelectOption {
  value: string;
  displayValue?: ReactNode;
  search?: string;
}
interface TUISelectProps {
  id?: string;
  label?: string;
  name?: string;
  isRequired?: boolean;
  placeholder?: string;
  style?: CSSProperties;
  error?: string;
  prefix?: ReactNode | string;
  onChange?: (data: UISelectOptionEvent) => void;
  options: UISelectOption[];
  defaultValue?: string;
  disabled?: boolean;
  showSearch?: boolean;
  instruction?: string;
}
export default function UISelect({
  id,
  label,
  name,
  isRequired,
  placeholder,
  style,
  error,
  prefix,
  onChange,
  options,
  defaultValue,
  disabled,
  showSearch,
  instruction,
}: TUISelectProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [show, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState<UISelectOption | null>(
    null
  );
  const [keyword, setKeyword] = useState<string | null>(null);
  const [filteredOptions, setFilteredOptions] =
    useState<UISelectOption[]>(options);

  const toggleShow = (val: boolean) => setShow(val);
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setKeyword(keyword ? keyword.trim() : null);
  };
  const handleOptionSelect = (e: UISelectOption) => {
    setSelectedOption(e);
    setSelectedIndex(-1);
    onChange &&
      onChange({
        target: {
          name: name ?? "SelectField",
          value: e.value,
          required: isRequired ?? false,
          type: "text",
        },
      });

    toggleShow(false);
  };
  const handleDisplayEvent = (e: MouseEvent<HTMLElement>) => {
    show ? toggleShow(false) : !disabled && toggleShow(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (
        wrapperRef.current &&
        typeof wrapperRef.current === "object" &&
        !wrapperRef.current?.contains(e.target as Node | null)
      ) {
        toggleShow(false);
        setFilteredOptions(options);
        setSelectedIndex(-1);
      }
    });
    return () => {
      document.removeEventListener("mousedown", () => null);
    };
  }, [wrapperRef, options]);

  useEffect(() => {
    let searchTimeout: NodeJS.Timeout | number | undefined;
    if (keyword) {
      searchTimeout = setTimeout(() => {
        setFilteredOptions(
          options.filter(
            (i) => (i.search ?? i.value).toLowerCase().indexOf(keyword) > -1
          )
        );
      }, 500);
    } else {
      setFilteredOptions(options);
    }

    return () => {
      clearTimeout(searchTimeout ? searchTimeout : undefined);
    };
  }, [keyword, options]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!show) return;
    console.log(e.key);

    if (e.key === "ArrowUp" && selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    } else if (
      e.key === "ArrowDown" &&
      selectedIndex < filteredOptions.length - 1
    ) {
      setSelectedIndex((prev) => prev + 1);
    } else if (e.key === "Enter" && selectedIndex !== -1) {
      handleOptionSelect(filteredOptions[selectedIndex]);
    }
  };

  return (
    <div className="selectfield" style={style} ref={wrapperRef}>
      {label ? (
        <label
          htmlFor={id ? id : ""}
          className="selectfield-label"
          onClick={handleDisplayEvent}
        >
          {label} {isRequired ? "*" : ""}
        </label>
      ) : null}

      <div className="selectfield-wrapper">
        {!show || !showSearch ? (
          <div
            className={`selectfield-display ${error ? "error" : ""}`}
            onClick={handleDisplayEvent}
          >
            <div className="selectfield-display--wrapper">
              {prefix ? (
                <div className="selectfield-display--prefix">{prefix}</div>
              ) : (
                ""
              )}
              <div className="selectfield-display--value">
                {selectedOption
                  ? selectedOption.displayValue ?? selectedOption.value
                  : defaultValue && options.find((i) => i.value == defaultValue)
                  ? options.find((i) => i.value == defaultValue)
                      ?.displayValue ??
                    options.find((i) => i.value == defaultValue)?.value
                  : placeholder ??
                    (options[0]
                      ? options[0].displayValue ?? options[0].value
                      : "Select")}
              </div>
            </div>
            <i className="fa-regular fa-chevron-down selectfield-display--arrow"></i>
          </div>
        ) : (
          <div className={`selectfield-search ${error ? "error" : ""}`}>
            <div className="selectfield-search--wrapper">
              <div className="selectfield-search--prefix">
                <i className="fa-regular fa-search"></i>
              </div>
              <input
                type="text"
                autoFocus={true}
                placeholder="Search.."
                className="selectfield-search--input"
                onChange={handleSearch}
              />
            </div>
            <i
              className="fa-regular fa-times selectfield-search--arrow"
              onClick={() => toggleShow(false)}
            ></i>
          </div>
        )}
      </div>

      {show ? (
        <div
          className="selectfield-options"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((child, index) => {
              return (
                <div
                  className={`selectfield-options--item ${
                    (selectedOption && selectedOption.value === child.value) ||
                    (!selectedOption && child.value === defaultValue)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleOptionSelect(child)}
                  onKeyDown={handleKeyDown}
                  key={child.value}
                  tabIndex={0}
                >
                  {child.displayValue ? child.displayValue : child.value}
                </div>
              );
            })
          ) : (
            <div className="selectfield-blank">No Options Found</div>
          )}
        </div>
      ) : null}

      {error ? <span className="selectfield-error">{error}</span> : null}

      {instruction ? (
        <p className="inputfield-instruction">{instruction}</p>
      ) : null}
    </div>
  );
}
