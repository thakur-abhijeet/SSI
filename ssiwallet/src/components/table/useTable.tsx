import { useCallback, useEffect, useState } from "react";
import { UITableBody } from ".";

export type PageSize = 10 | 25 | 50 | 100;

export type TableConfig = {
  pageCount: number;
  pagination: (data: { page: number; size: number }) => void;
  search: (val?: string) => void;
  disableConfig: boolean;
};

type PaginationInfo = {
  hasNext: boolean;
  hasPrevious: boolean;
  startIndex: number;
  endIndex: number;
};
type TUseTableProps<T> = {
  originalData: UITableBody<T>[];
  customConfig?: TableConfig;
};

export default function useTable<T>({
  originalData,
  customConfig,
}: TUseTableProps<T>) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [state, setState] = useState<UITableBody<T>[]>(originalData);
  const [filteredState, setFilteredState] =
    useState<UITableBody<T>[]>(originalData);
  const [displayRows, setDisplayRows] = useState<UITableBody<T>[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    hasNext: false,
    hasPrevious: false,
    endIndex: pageSize - 1,
    startIndex: 0,
  });

  const handleNextPage = () => {
    const next = currentPage + 1;

    setCurrentPage(next);

    customConfig &&
    !customConfig.disableConfig &&
    currentPage < customConfig.pageCount
      ? customConfig.pagination({ page: next, size: pageSize })
      : handlePagination(next, pageSize, filteredState, "next");
  };
  const handlePreviousPage = () => {
    if (currentPage < 2) return;
    const previous = currentPage - 1;
    setCurrentPage(previous);

    customConfig && !customConfig.disableConfig
      ? customConfig.pagination({ page: previous, size: pageSize })
      : handlePagination(previous, pageSize, filteredState, "previous");
  };
  const handlePageSize = (val: PageSize) => {
    setPageSize(val);

    customConfig && !customConfig.disableConfig
      ? customConfig.pagination({ page: currentPage, size: val })
      : handlePagination(currentPage, val, filteredState, "size");
  };

  const handlePagination = useCallback(
    (
      currentPage: number,
      pageSize: number,
      data: UITableBody<T>[],
      from?: string
    ) => {
      const offset = (currentPage - 1) * pageSize;
      const limit = pageSize;

      const tempData =
        customConfig && !customConfig.disableConfig
          ? data
          : data.slice(offset, offset + limit);

      const paginationInfo = {
        hasNext:
          !customConfig || customConfig?.disableConfig
            ? data[offset + limit] !== undefined
            : currentPage < customConfig.pageCount,
        hasPrevious: currentPage > 1,
        startIndex: offset,
        endIndex: offset + limit,
      };

      setDisplayRows(tempData);
      setPaginationInfo(paginationInfo);
    },
    [customConfig]
  );

  const resetKeywordSearch = useCallback(() => {
    if (customConfig) {
      customConfig.search();
      return;
    }

    setFilteredState(state);
    setCurrentPage(1);
    handlePagination(1, pageSize, state, "reset");
  }, [
    setFilteredState,
    setCurrentPage,
    handlePagination,
    customConfig,
    pageSize,
    state,
  ]);

  const handleKeywordSearch = useCallback(
    (val: string, data: UITableBody<T>[]) => {
      const keyword = val.trim().toLowerCase();

      console.log(keyword, state);

      if (customConfig) {
        customConfig.search(keyword);
        setCurrentPage(1);
        return;
      }

      const newDataSet = data.filter((item, _) => {
        let isValid = false;
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            const element = item[key];
            console.log(
              element.value?.toString().toLowerCase().indexOf(keyword) > -1
            );

            if (element.value?.toString().toLowerCase().indexOf(keyword) > -1) {
              isValid = true;
              break;
            }
          }
        }

        return isValid;
      });

      setFilteredState(newDataSet);
      handlePagination(1, pageSize, newDataSet, "search");
      setCurrentPage(1);
    },
    [handlePagination, customConfig, pageSize]
  );

  const rearrangeElement = (
    origin: number,
    destination: number,
    callback?: () => void
  ) => {
    const updatedRows = [...displayRows];
    const [draggedRow] = updatedRows.splice(origin, 1);

    updatedRows.splice(destination, 0, draggedRow);
    setDisplayRows(updatedRows);
    callback && callback();
  };

  useEffect(() => {
    setState(originalData);
    setFilteredState(originalData);

    originalData.length > 0 &&
      handlePagination(currentPage, pageSize, originalData, "effect");
  }, [originalData, currentPage, pageSize, handlePagination]);

  return {
    displayRows,
    filteredState,
    state,
    pageSize,
    currentPage,
    paginationInfo,

    handleNextPage,
    handlePreviousPage,
    handlePageSize,
    handleKeywordSearch,
    resetKeywordSearch,
    rearrangeElement,
  };
}
