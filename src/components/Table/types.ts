export type ColumnType = "text" | "number" | "date" | "boolean" | "link";

export interface Column<T> {
  key: keyof T;
  title: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  type?: ColumnType;
  options?: Array<{ label: string; value: any }>;
  render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  sortable?: boolean;
  onSort?: (key: keyof T, direction: "asc" | "desc") => void;
  searchable?: boolean;
  filters?: Record<string, any>;
  onFilterChange?: (key: keyof T, value: any) => void;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onRowEdit?: (row: T, rowIndex: number) => void;
  onRowDelete?: (row: T, rowIndex: number) => void;
  resizable?: boolean;
  stickyHeader?: boolean;
}
