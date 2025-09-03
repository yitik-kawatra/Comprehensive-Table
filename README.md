# Table Component

A fully featured, customizable, and accessible React Table component with Tailwind CSS, supporting sorting, search, filters, column visibility, inline editing, pagination, loading/empty states, and more.

## Features

- Sorting (click column headers)
- Search and advanced filters
- Column visibility control
- Inline cell editing
- Pagination
- Loading and empty states
- Custom cell renderers
- Resizable columns
- Sticky header
- Full Storybook coverage

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Run Storybook

```bash
npm run storybook
```

### 4. Build for production

```bash
npm run build
```

## Usage

### Import the Table component

```tsx
import { Table } from "./components/Table/Table";
import type { Column } from "./components/Table/types";
```

### Define your columns and data

```tsx
const columns: Column<MyRowType>[] = [
  { title: "Name", key: "name", type: "text" },
  { title: "Status", key: "status", type: "text", filterable: true, ... },
];

const data: MyRowType[] = [
  { name: "Alice", status: "Active", ... },
];
```

### Render the Table

```tsx
<Table
  columns={columns}
  data={data}
  total={data.length}
  sortable
  searchable
  filters={filters}
  onFilterChange={handleFilterChange}
  page={page}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
  onCellEdit={handleCellEdit}
  resizable
  stickyHeader
/>
```

### Custom Renderers

You can provide a `render` function in any column to customize cell rendering.

```tsx
{
  title: "Email",
  key: "email",
  render: (email) => <a href={`mailto:${email}`}>{email}</a>
}
```

### Column Visibility

Use the `ColumnVisibilityControl` component to allow users to show/hide columns.

```tsx
<ColumnVisibilityControl columns={columns} visibleCols={visibleCols} setVisibleCols={setVisibleCols} />
```

### Search and Filters

Use the `TableSearchFilters` component for a custom search/filter UI.

```tsx
<TableSearchFilters
  searchable
  search={search}
  onSearchChange={setSearch}
  filters={filters}
  onFilterChange={setFilters}
  columns={columns}
/>
```

## Storybook

All features are demonstrated in Storybook. Run:

```bash
npm run storybook
```

and open [http://localhost:6006](http://localhost:6006) to view stories for:

- Basic usage
- Sorting
- Search
- Filters
- Column visibility
- Inline edit
- Pagination
- Loading/empty state
- Custom renderers
- Resizable columns
- Full feature demo

## Extensibility

- All components are modular and can be used independently.
- Tailwind CSS is used for styling; you can customize via your Tailwind config.
- The Table is fully typed with TypeScript for safety and autocompletion.

