import React from "react";
import type { Column } from "./types";

interface ColumnVisibilityControlProps<T> {
  columns: Array<Column<T>>;
  visibleCols: (keyof T | string)[];
  setVisibleCols: React.Dispatch<React.SetStateAction<(keyof T | string)[]>>;
}

export function ColumnVisibilityControl<T>({
  columns,
  visibleCols,
  setVisibleCols,
}: ColumnVisibilityControlProps<T>) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="bg-gray-50 border border-gray-300 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-gray-100 transition"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="inline-flex items-center gap-1">
          <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
            <rect width="20" height="20" rx="4" fill="#F3F4F6" />
            <path
              d="M6 8.5a1.5 1.5 0 1 1 3 0v3a1.5 1.5 0 1 1-3 0v-3Zm5 0a1.5 1.5 0 1 1 3 0v3a1.5 1.5 0 1 1-3 0v-3Z"
              fill="#6B7280"
            />
          </svg>
          Columns
        </span>
      </button>
      {open && (
        <div className="absolute z-[100] bg-white border rounded shadow p-2 mt-1 left-0 min-w-[160px] max-w-[800px] overflow-x-auto">
          {columns.map((col) => (
            <label key={String(col.key)} className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={visibleCols.map(String).includes(String(col.key))}
                onChange={() => {
                  if (visibleCols.map(String).includes(String(col.key))) {
                    setVisibleCols(visibleCols.filter((k) => String(k) !== String(col.key)));
                  } else {
                    const originalIdx = columns.findIndex(c => String(c.key) === String(col.key));
                    let newCols = [...visibleCols];
                    newCols = newCols.filter((k) => String(k) !== String(col.key));
                    newCols.splice(originalIdx, 0, col.key);
                    setVisibleCols(newCols);
                  }
                }}
              />
              {col.title}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
