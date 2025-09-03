import type { Column } from "./types";

interface TableSearchFiltersProps<T> {
  searchable?: boolean;
  search?: string;
  onSearchChange?: (value: string) => void;
  filters?: Record<string, any>;
  onFilterChange?: (key: string, value: any) => void;
  columns: Array<Column<T>>;
}

export function TableSearchFilters<T>({
  searchable,
  search,
  onSearchChange,
  filters,
  onFilterChange,
  columns,
}: TableSearchFiltersProps<T>) {
  return (
    <div className="flex gap-3 mb-4 items-center">
      {searchable && (
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-full text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 transition min-w-[200px]"
        />
      )}
      {filters &&
        columns
          .filter((col) => col.filterable)
          .map((col) =>
            col.options ? (
              <select
                key={String(col.key)}
                value={filters[col.key as string] ?? ""}
                onChange={(e) => onFilterChange?.(String(col.key), e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-full text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 transition min-w-[140px]"
              >
                <option value="">All {col.title}</option>
                {col.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                key={String(col.key)}
                type="text"
                placeholder={`Filter ${col.title}`}
                value={filters[col.key as string] ?? ""}
                onChange={(e) => onFilterChange?.(String(col.key), e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-full text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 transition min-w-[140px]"
              />
            )
          )}
    </div>
  );
}
