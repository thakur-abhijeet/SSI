import UICard from "@/ui/uicard";
import UIInput from "@/ui/uiinput";
import UISelect from "@/ui/uiselect";
import {
  CSSProperties,
  ChangeEvent,
  DragEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import UIButton from "@/ui/uibutton";
import useTable, { PageSize, TableConfig } from "./useTable";
import UISkeleton from "@/ui/uiskeleton";

export type UITableHeader<T> = {
  name: keyof T;
  display?: string;
  sticky?: boolean;
};
export type UITableBody<T> = {
  [K in keyof T]: {
    value: string | number;
    display?: string | ReactNode;
  };
};

interface UITableProps<T> {
  rawData: UITableBody<T>[];
  headings: UITableHeader<T>[];
  customActions?: ReactNode;
  exportSchema?: (keyof T)[];

  disableControls?: boolean;

  customConfig?: TableConfig;
  loading?: boolean;

  rearrange?: (start: number, end: number) => void;
  style?: CSSProperties;
  showFooter?: boolean;
  overflow?: "visible" | "auto";
}
export default function UITable<T>({
  rawData,
  headings,
  customActions,
  exportSchema,
  disableControls,
  customConfig,
  loading,
  rearrange,
  style = {},
  showFooter = false,
  overflow = "auto",
}: UITableProps<T>) {
  const [keyword, setKeyword] = useState<string | null>(null);
  const [grabOrigin, setGrabOrigin] = useState<number | null>(null);

  const {
    currentPage,
    displayRows,
    filteredState,
    pageSize,
    paginationInfo,
    state,
    handleKeywordSearch,
    handleNextPage,
    handlePageSize,
    handlePreviousPage,
    rearrangeElement,
    resetKeywordSearch,
  } = useTable<T>({
    originalData: rawData,
    customConfig: customConfig,
  });

  const exportToCSV = () => {
    if (!exportSchema || exportSchema.length < 1) return;

    let CSVDATA = "";
    exportSchema.forEach((i) => {
      CSVDATA += i.toString() + ",";
    });
    CSVDATA = CSVDATA.slice(0, -1);
    CSVDATA += "\r\n";

    for (let i = 0; i < filteredState.length; i++) {
      const element = filteredState[i];
      exportSchema.forEach((item) => {
        CSVDATA += `"${element[item].value}",`;
      });

      CSVDATA.slice(0, CSVDATA.length - 1);
      CSVDATA += "\r\n";
    }

    const blob = new Blob([CSVDATA], { type: "text/csv" });
    const url = window.webkitURL.createObjectURL(blob);
    const elem = document.createElement("a");
    elem.setAttribute("href", url);
    elem.setAttribute("download", "ExportData-" + Date.now() + ".csv");
    elem.click();
  };

  const handleDragStart = (
    e: DragEvent<HTMLTableRowElement>,
    index: number
  ) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("start");

    setGrabOrigin(index);
  };
  const handleDragEnd = (e: DragEvent<HTMLTableRowElement>) => {
    e.currentTarget.classList.remove("start");
  };
  const handleDragOver = (e: DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("highlight");
  };
  const handleDragLeave = (e: DragEvent<HTMLTableRowElement>) => {
    e.currentTarget.classList.remove("highlight");
  };
  const handleDragDrop = (e: DragEvent<HTMLTableRowElement>, index: number) => {
    e.currentTarget.classList.remove("highlight");
    if (grabOrigin === null) return;
    rearrange?.(grabOrigin, index);
    rearrangeElement(grabOrigin, index, () => setGrabOrigin(null));
  };

  const handleKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setKeyword(val);
  };
  useEffect(() => {
    let searchTimeout: NodeJS.Timeout | number | undefined;
    if (keyword) {
      searchTimeout = setTimeout(() => {
        handleKeywordSearch(keyword, state);
      }, 500);
    } else {
      resetKeywordSearch();
    }

    return () => {
      clearTimeout(searchTimeout ? searchTimeout : undefined);
    };
  }, [keyword]);

  return (
    <div className="table">
      <div className="table-actions">
        <div className="table-actions--left">
          {loading ? (
            <>
              <UISkeleton style={{ width: "20rem", height: "4rem" }} />
            </>
          ) : !disableControls ? (
            <>
              Showing Results:{" "}
              {!customConfig || customConfig.disableConfig
                ? `${Math.max(paginationInfo.startIndex + 1, 0)}-${Math.min(
                    paginationInfo.endIndex,
                    filteredState.length
                  )} of ${filteredState.length}`
                : `${paginationInfo.startIndex + 1}-${paginationInfo.endIndex}`}
            </>
          ) : null}
        </div>
        <div className="table-actions--right">
          {loading ? (
            <>
              <UISkeleton style={{ width: "30rem", height: "3.5rem" }} />
              <UISkeleton style={{ width: "7rem", height: "3.5rem" }} />
              <UISkeleton style={{ width: "10rem", height: "3.5rem" }} />
            </>
          ) : !disableControls ? (
            <>
              <UIInput
                label="Search"
                id="table-actions--right__search"
                placeholder="eg. Search.."
                name="search"
                style={{ width: "30rem" }}
                onChange={handleKeyword}
                autoComplete="nope"
              />
              <UISelect
                label="Rows"
                style={{ width: "7rem" }}
                options={[
                  { value: "10" },
                  { value: "25" },
                  { value: "50" },
                  { value: "100" },
                ]}
                defaultValue={pageSize.toString()}
                onChange={(e) =>
                  handlePageSize(+(e.target.value ?? 10) as PageSize)
                }
              />
              {exportSchema && exportSchema.length > 0 ? (
                <UIButton
                  label={
                    <span>
                      <i className="fa-regular fa-file-export"></i> Export
                    </span>
                  }
                  type="secondary"
                  style={{ minWidth: "10rem" }}
                  onClick={() => exportToCSV()}
                />
              ) : null}
            </>
          ) : null}
          {!loading && customActions}
        </div>
      </div>
      {loading ? (
        <UISkeleton style={{ width: "100%", height: "75vh" }} />
      ) : (
        <UICard
          style={{
            maxHeight: "75vh",
            ...style,
            padding: "0",
            overflow: overflow,
            position: "relative",
          }}
        >
          <table className="table-content">
            <thead>
              <tr>
                <th>#</th>
                {headings.map((item, index) => (
                  <th className={`${item.sticky ? "sticky" : ""}`} key={index}>
                    {item.display}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.length < 1 ? (
                <tr>
                  <td colSpan={100} className="noresult">
                    No data found
                  </td>
                </tr>
              ) : (
                displayRows.map((item, index) => (
                  <tr
                    draggable={rearrange && true}
                    onDragStart={(e) => rearrange && handleDragStart(e, index)}
                    onDragLeave={(e) => rearrange && handleDragLeave(e)}
                    onDragEnd={(e) => rearrange && handleDragEnd(e)}
                    onDragOver={(e) => rearrange && handleDragOver(e)}
                    onDrop={(e) => rearrange && handleDragDrop(e, index)}
                    key={index}
                  >
                    <td>{paginationInfo.startIndex + index + 1}</td>
                    {headings.map((h, i) => {
                      const tempValue = item[h.name];
                      return (
                        <td
                          key={Math.random()}
                          className={h.sticky ? "sticky" : ""}
                        >
                          {tempValue.display
                            ? tempValue.display
                            : tempValue.value}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
            {showFooter ? (
              <tfoot>
                <tr>
                  <th>#</th>
                  {headings.map((item, index) => (
                    <th
                      className={`${item.sticky ? "sticky" : ""}`}
                      key={index}
                    >
                      {item.display}
                    </th>
                  ))}
                </tr>
              </tfoot>
            ) : null}
          </table>
        </UICard>
      )}
      {!disableControls ? (
        <div className="table-pagination">
          {loading ? (
            <>
              <UISkeleton style={{ width: "7rem", height: "3.5rem" }} />
              <UISkeleton style={{ width: "3.5rem", height: "3.5rem" }} />
              <UISkeleton style={{ width: "7rem", height: "3.5rem" }} />
            </>
          ) : (
            <>
              <div
                className={`table-pagination--previous ${
                  paginationInfo.hasPrevious ? "" : "disabled"
                }`}
                onClick={handlePreviousPage}
              >
                <i className="fa-regular fa-chevron-left"></i>
                <span>Previous</span>
              </div>
              <div className="table-pagination--current">
                <span>{currentPage}</span>
              </div>
              <div
                className={`table-pagination--next ${
                  paginationInfo.hasNext ? "" : "disabled"
                }`}
                onClick={handleNextPage}
              >
                <span>Next</span>
                <i className="fa-regular fa-chevron-right"></i>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

function BuildSkeleton({ num }: { num: number }) {
  return new Array(num).fill(0).map((_, idx) => (
    <tr className="skeleton" key={idx}>
      <td colSpan={100}>
        <UISkeleton />
      </td>
    </tr>
  ));
}
