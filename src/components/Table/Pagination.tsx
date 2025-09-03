import React from "react";

interface PaginationProps {
  total: number;
  defaultPage?: number;
  defaultPageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  total,
  defaultPage = 1,
  defaultPageSize = 10,
  onChange,
}) => {
  const [page, setPage] = React.useState(defaultPage);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);

  React.useEffect(() => {
    onChange?.(page, pageSize);
  }, [page, pageSize, onChange]);

  const totalPages = Math.ceil(total / pageSize);

const getPageNumbers = (): (number | string)[] => {
  const DOTS = "...";
  const pages: (number | string)[] = [];

  const current = Math.max(1, Math.min(page, totalPages));

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  let start = Math.max(2, current - 2);
  let end = Math.min(totalPages - 1, current + 2);

  if (current <= 4) {
    start = 2;
    end = 5;
  } else if (current >= totalPages - 3) {
    start = totalPages - 4;
    end = totalPages - 1;
  }

  if (start > 2) {
    pages.push(DOTS);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push(DOTS);
  }

  pages.push(totalPages);
  return pages;
};


  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  return (
    <div className="flex items-center justify-between w-full px-0 py-2 bg-white min-h-[48px] border-t border-[#ECECEC] rounded-b-2xl">
      <div className="flex items-center text-xs text-gray-500 pl-2">
        {total} total contracts
      </div>
      <div className="flex items-center gap-2 ml-auto pr-2 text-[#7B809A]">
        <span className="text-sm mr-1">Per page</span>
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="border border-gray-300 rounded-full px-3 py-1.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 transition text-[#1A237E] min-w-[56px]"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition text-[18px] min-w-[32px] p-0"
        >
          {"<"}
        </button>
        {getPageNumbers().map((p, idx) =>
          p === "..." ? (
            <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-400 select-none">
              ...
            </span>
          ) : (
            <button
              key={`page-${p}-${idx}`}
              onClick={() => handlePageChange(Number(p))}
              className={`w-8 h-8 flex items-center justify-center rounded-full border hover:bg-gray-100 transition min-w-[32px] text-[15px] ${page === p ? "bg-blue-50 border-blue-400 text-blue-700 font-bold" : "border-gray-300 bg-white text-gray-500 font-normal"}`}
              disabled={page === p}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition text-[18px] min-w-[32px] p-0"
        >
          {">"}
        </button>
      </div>
    </div>
  );
};
