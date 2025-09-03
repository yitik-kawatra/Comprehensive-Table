import React, { useState, useRef, useEffect } from "react";
import type { TableProps } from "./types";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";
import { TableSearchFilters } from "./TableSearchFilters";
import { ColumnVisibilityControl } from "./ColumnVisibilityControl";

export function Table<T>({
  columns,
  data,
  loading,
  emptyMessage,
  sortable,
  onSort,
  searchable,
  filters,
  onFilterChange,
  total = 0,
  resizable,
  stickyHeader,
  onCellEdit,
}: TableProps<T> & { onCellEdit?: (rowIdx: number, key: string, value: any) => void }) {
  const [editingCell, setEditingCell] = useState<{ row: number; key: string } | null>(null);
  const [editValue, setEditValue] = useState<any>("");

  const startEdit = (rowIdx: number, key: string, value: any) => {
    setEditingCell({ row: rowIdx, key });
    setEditValue(value);
  };
  const saveEdit = (rowIdx: number, key: string) => {
    setTableData((prev) =>
      prev.map((r, i) => (i === rowIdx ? { ...r, [key]: editValue } : r))
    );
    if (onCellEdit) {
      onCellEdit(rowIdx, key, editValue);
    }
    setEditingCell(null);
  };

  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(null);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [tableData, setTableData] = useState<T[]>(data);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  const [colWidths, setColWidths] = useState<{ [k: string]: number }>(() =>
    Object.fromEntries(columns.map((c) => [String(c.key), c.width ?? 120]))
  );

  const resizingColRef = useRef<{
    key: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleSort = (key: keyof T) => {
    if (!sortable) return;
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  let filteredData = tableData;
  if (searchable && search) {
    filteredData = filteredData.filter((row) =>
      columns.some((col) =>
        String(row[col.key] ?? "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        filteredData = filteredData.filter((row) =>
          String(row[key as keyof T] ?? "").toLowerCase().includes(String(value).toLowerCase())
        );
      }
    });
  }

  if (sortConfig) {
    const { key, direction } = sortConfig;
    filteredData = [...filteredData].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * currentPageSize,
    currentPage * currentPageSize
  );

  const allSelected = paginatedData.length > 0 && paginatedData.every((_, idx) => selectedRows.has(idx));
  const someSelected = paginatedData.some((_, idx) => selectedRows.has(idx));

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map((_, idx) => idx)));
    }
  };

  const handleSelectRow = (idx: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleBulkDelete = () => {
    const remaining = tableData.filter((_, idx) => !selectedRows.has(idx));
    setTableData(remaining);
    setSelectedRows(new Set());
  };

  const onMouseDownResize = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    resizingColRef.current = {
      key,
      startX: e.clientX,
      startWidth: colWidths[key],
    };
    window.addEventListener("mousemove", onMouseMoveResize);
    window.addEventListener("mouseup", onMouseUpResize);
  };

  function onMouseMoveResize(e: MouseEvent) {
    if (!resizingColRef.current) return;
    const { key, startX, startWidth } = resizingColRef.current;
    const newWidth = Math.max(60, startWidth + e.clientX - startX);
    setColWidths((prev) => ({
      ...prev,
      [key]: newWidth,
    }));
  };

  const onMouseUpResize = () => {
    resizingColRef.current = null;
    window.removeEventListener("mousemove", onMouseMoveResize);
    window.removeEventListener("mouseup", onMouseUpResize);
  };

  const [visibleCols, setVisibleCols] = React.useState<(keyof T | string)[]>(() => columns.map((col) => col.key));


  return (
    <>
      <div className="flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200 p-4 h-[480px] min-h-[320px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {selectedRows.size > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                className="bg-red-50 text-red-700 px-4 py-1.5 rounded-full border border-red-200 text-sm font-medium shadow-sm hover:bg-red-100 transition"
              >
                Delete Selected
              </button>
            )}
            <ColumnVisibilityControl columns={columns} visibleCols={visibleCols} setVisibleCols={setVisibleCols} />
          </div>
        </div>

        {(searchable || (filters && Object.keys(filters).length > 0)) && (
          <TableSearchFilters
            searchable={searchable}
            search={search}
            onSearchChange={setSearch}
            filters={filters}
            onFilterChange={onFilterChange as ((key: string, value: any) => void) | undefined}
            columns={columns}
          />
        )}

        <div className="flex-1 overflow-auto relative min-h-0">
          <table
            className="w-full text-sm table-auto text-left border-separate [border-spacing:0] table-fixed"
          >
            <thead>
              <tr>
                <th
                  className={`px-2 py-2 w-14 text-center align-middle ${stickyHeader ? "sticky top-0 z-20 bg-gray-100" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = !allSelected && someSelected;
                    }}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                    className="w-[18px] h-[18px] cursor-pointer align-middle"
                  />
                </th>
                {visibleCols.map((key) => {
                  const col = columns.find((c) => String(c.key) === String(key))!;
                  return (
                    <th
                      key={String(col.key)}
                      className={`px-3 py-2 text-left font-medium whitespace-nowrap relative group min-w-[120px] ${sortable ? "cursor-pointer select-none" : ""} ${stickyHeader ? "sticky top-0 z-20 bg-gray-100" : ""}`}
                      style={{
                        width: colWidths[String(col.key)]
                      }}
                      {...(sortable
                        ? {
                            onClick: () => handleSort(col.key),
                            tabIndex: 0,
                            onKeyDown: (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleSort(col.key);
                              }
                            },
                            "aria-sort":
                              sortConfig?.key === col.key
                                ? sortConfig.direction === "asc"
                                  ? "ascending"
                                  : "descending"
                                : undefined,
                          }
                        : {})}
                    >
                      <div className="flex items-center">
                        <span>{col.title}</span>
                        {sortable && (
                          <span
                          className={`ml-1 select-none inline-block w-4 text-center text-xs ${
                            sortConfig?.key === col.key
                              ? "text-blue-600 font-bold"
                              : "text-gray-400 font-normal"
                          }`}
                        >
                          {sortConfig?.key === col.key
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : "▲"}
                        </span>
                        )}
                        {resizable && (
                          <span
                            className="absolute right-[-5px] top-0 h-full w-[10px] z-25 inline-flex items-center justify-center cursor-col-resize group-hover:bg-blue-100 rounded-[2px] border-l-[2px] border-[#bcd0ee] bg-[#e0e7ef] select-none"
                            onMouseDown={(e) => onMouseDownResize(e, String(col.key))}
                          >
                            <div
                              className="w-[3px] h-[24px] bg-[#bcd0ee] rounded-[2px] mx-[2px]"
                            />
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
                <th
                  className="px-0 py-0 w-10 text-center align-middle sticky right-0 top-0 z-30 bg-gray-100"
                >
                  <button
                    type="button"
                    aria-label="Scroll right"
                    className="flex items-center justify-center w-8 h-8 ml-1 rounded-full bg-white border border-gray-200 shadow hover:bg-gray-100 transition text-blue-600"
                    onClick={() => {
                      const tableDiv = document.querySelector(".flex-1.overflow-auto");
                      if (tableDiv) {
                        (tableDiv as HTMLElement).scrollBy({ left: 200, behavior: "smooth" });
                      }
                    }}
                  >
                    <svg
                      className="w-4 h-4 min-w-[18px] min-h-[18px]"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </th>
              </tr>
            </thead>

            {loading ? (
              <LoadingState rows={currentPageSize} columns={columns.length} />
            ) : filteredData.length === 0 ? (
              <EmptyState message={emptyMessage} />
            ) : (
              <tbody>
                {paginatedData.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50 transition">
                    <td className="px-2 py-2 w-14 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(idx)}
                        onChange={() => handleSelectRow(idx)}
                        aria-label={`Select row ${idx + 1 + (currentPage - 1) * currentPageSize}`}
                        className="w-[18px] h-[18px] cursor-pointer align-middle"
                      />
                    </td>
                    {(visibleCols as Array<keyof T | string>).map((key) => {
                      const col = columns.find((c) => String(c.key) === String(key))!;
                      const isEditable = !col.render && (!col.type || col.type === "text" || col.type === "date");
                      const cellKey = String(col.key);

                      if (isEditable && editingCell && editingCell.row === idx && editingCell.key === cellKey) {
                        return (
                          <td key={cellKey} className="px-3 py-2 min-w-[120px]" style={{ width: colWidths[cellKey] }}>
                            <input
                              type={col.type === "date" ? "date" : "text"}
                              value={editValue}
                              autoFocus
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={() => saveEdit(idx, String(col.key))}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit(idx, String(col.key));
                                if (e.key === "Escape") setEditingCell(null);
                              }}
                              className="border px-1 py-0.5 rounded text-sm w-full"
                            />
                          </td>
                        );
                      }

                      return (
                        <td
                          key={cellKey}
                          className={`px-3 py-2 min-w-[120px] max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap ${isEditable ? "cursor-pointer hover:bg-gray-100" : ""}`}
                          style={{
                            width: colWidths[cellKey]
                          }}
                          onDoubleClick={isEditable ? () => startEdit(idx, String(col.key), row[col.key]) : undefined}
                          title={isEditable ? "Double-click to edit" : undefined}
                        >
                          {col.render
                            ? col.render(row[col.key], row, idx)
                            : col.type === "boolean"
                            ? row[col.key] === true
                              ? "Yes"
                              : row[col.key] === false
                              ? "No"
                              : ""
                            : col.options && col.type === "text"
                            ? (() => {
                                const opt = col.options?.find((o) => o.value === row[col.key]);
                                let badgeClass = "bg-gray-100 text-gray-700";
                                if (typeof row[col.key] === "string") {
                                  if (/active/i.test(row[col.key] as string)) {
                                    badgeClass = "bg-green-50 text-green-700";
                                  } else if (/expired/i.test(row[col.key] as string)) {
                                    badgeClass = "bg-orange-50 text-orange-700";
                                  } else if (/terminated/i.test(row[col.key] as string)) {
                                    badgeClass = "bg-red-50 text-red-700";
                                  }
                                }
                                return (
                                  <span
                                    className={`inline-block min-w-[70px] text-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide border border-transparent ${badgeClass}`}
                                  >
                                    {opt?.label ?? String(row[col.key] ?? "")}
                                  </span>
                                );
                              })()
                            : String(row[col.key] ?? "")}
                          {isEditable && (
                            <button
                              type="button"
                              className="ml-2 text-xs text-blue-500 underline invisible"
                              tabIndex={-1}
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        {filteredData.length > 0 && (
          <div className="pt-2">
            <Pagination
              total={total}
              onChange={(newPage, newPageSize) => {
                setCurrentPage(newPage);
                setCurrentPageSize(newPageSize);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
