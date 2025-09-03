import React from "react";
import { Table } from "./Table";
import type { Column } from "./types";
import "../../index.css";

type DemoRow = {
  id: number;
  name: string;
  email: string;
  website: string;
  age: number;
  active: boolean;
  joinDate: string;
  profile: string;
  status: "Active" | "Terminated" | "Expired";
};

const columns: Column<DemoRow>[] = [
  { title: "Name", key: "name", width: 180, type: "text" },
  {
    title: "Status",
    key: "status",
    width: 120,
    type: "text",
    filterable: true,
    options: [
      { label: "Active", value: "Active" },
      { label: "Terminated", value: "Terminated" },
      { label: "Expired", value: "Expired" },
    ],
    render: (status) => {
      let badgeClass = "bg-gray-100 text-gray-700";
      if (status === "Active") badgeClass = "bg-green-50 text-green-700";
      else if (status === "Terminated") badgeClass = "bg-red-50 text-red-700";
      else if (status === "Expired") badgeClass = "bg-orange-50 text-orange-700";
      return (
        <span
          className={`inline-block min-w-[70px] text-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    title: "Email",
    key: "email",
    width: 220,
    type: "text",
    render: (email) => (
      <a href={`mailto:${email}`} className="text-blue-600 underline">
        {email}
      </a>
    ),
  },
  {
    title: "Website",
    key: "website",
    width: 200,
    type: "link",
    render: (website) => (
      <a
        href={website}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline"
      >
        {website.replace(/^https?:\/\//, "")}
      </a>
    ),
  },
  { title: "Age", key: "age", width: 80, type: "number", filterable: true },
  { title: "Active", key: "active", width: 100, type: "boolean", filterable: true },
  { title: "Join Date", key: "joinDate", width: 140, type: "date" },
  {
    title: "Profile",
    key: "profile",
    width: 180,
    type: "link",
    render: (profileUrl) => (
      <a
        href={profileUrl}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline"
      >
        View Profile
      </a>
    ),
  },
];

// Helpers
const randomFrom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start: Date, end: Date) => {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().slice(0, 10);
};
const makeRows = (n = 20): DemoRow[] =>
  Array.from({ length: n }, (_, i) => {
    const names = ["Alice Smith", "Bob Lee", "Charlie Kim", "Dana White", "Eve Black", "Frank Green"];
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "company.com"];
    const sites = ["https://google.com", "https://github.com", "https://vercel.com", "https://example.com"];
    const ages = [22, 28, 31, 35, 40, 45, 50, 55];
    const profiles = [
      "https://linkedin.com/in/alice",
      "https://linkedin.com/in/bob",
      "https://linkedin.com/in/charlie",
      "https://linkedin.com/in/dana",
      "https://linkedin.com/in/eve",
      "https://linkedin.com/in/frank",
    ];
    const statuses: DemoRow["status"][] = ["Active", "Terminated", "Expired"];
    const name = randomFrom(names);
    const email = name.toLowerCase().replace(/ /g, ".") + "@" + randomFrom(domains);
    return {
      id: i + 1,
      name,
      email,
      website: randomFrom(sites),
      age: randomFrom(ages),
      active: Math.random() < 0.6,
      joinDate: randomDate(new Date(2018, 0, 1), new Date(2024, 0, 1)),
      profile: randomFrom(profiles),
      status: randomFrom(statuses),
    };
  });

export default {
  title: "Components/Table",
  component: Table,
};

// ✅ Stories (simplified since Table now handles filters/pagination/search internally)
export const Basic = () => (
  <div className="w-full max-w-[800px] h-[600px] overflow-auto">
    <Table<DemoRow> columns={columns} data={makeRows(10)} />
  </div>
);

export const WithSorting = () => (
  <div className="w-full max-w-[800px] h-[600px] overflow-auto">
    <Table<DemoRow> columns={columns} data={makeRows(10)} sortable />
  </div>
);

export const WithSearch = () => (
  <div className="w-full max-w-[800px] h-[600px] overflow-auto">
    <Table<DemoRow> columns={columns} data={makeRows(10)} searchable />
  </div>
);

export const WithFilters = () => (
  <div className="w-full max-w-[800px] h-[600px] overflow-auto">
    <Table<DemoRow> columns={columns} data={makeRows(10)} />
  </div>
);

export const WithInlineEdit = () => {
  const [rows, setRows] = React.useState(makeRows(10));
  return (
    <div className="w-full max-w-[800px] h-[600px] overflow-auto">
      <Table<DemoRow>
        columns={columns}
        data={rows}
        onCellEdit={(rowIdx, key, value) => {
          setRows((prevRows) =>
            prevRows.map((row, idx) =>
              idx === rowIdx ? { ...row, [key]: value } : row
            )
          );
        }}
      />
    </div>
  );
};

export const WithPagination = () => (
  <div className="w-full max-w-[800px] h-[600px] overflow-auto">
    <Table<DemoRow> columns={columns} data={makeRows(30)} />
  </div>
);

export const WithLoadingState = () => (
  <div className="w-full max-w-[800px] h-[600px] overflow-auto">
    <Table<DemoRow> columns={columns} data={[]} loading />
  </div>
);

export const WithCustomRenderers = () => (
  <div className="w-full max-w-[800px] h-[600px] overflow-auto">
    <Table<DemoRow> columns={columns} data={makeRows(10)} />
  </div>
);

export const NoData = () => (
  <div className="w-full max-w-[800px] h-[600px] overflow-auto">
    <Table<DemoRow>
      columns={columns}
      data={[]}
      emptyMessage="No data available for this table."
    />
  </div>
);

export const WithResizableColumns = () => (
  <div className="w-full max-w-[800px] h-[600px] overflow-auto">
    <Table<DemoRow> columns={columns} data={makeRows(10)} resizable />
  </div>
);

export const FullFeatureDemo = () => {
  const [rows, setRows] = React.useState(makeRows(50));
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="p-8 w-full max-w-[800px] h-[700px] overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Full Feature Table Demo</h2>
      <div className="w-full h-[600px]">
        <Table<DemoRow>
          columns={columns}
          data={rows}
          loading={loading}
          searchable
          sortable
          resizable
          stickyHeader
          onCellEdit={(rowIdx, key, value) => {
            setRows((prevRows) =>
              prevRows.map((row, idx) =>
                idx === rowIdx ? { ...row, [key]: value } : row
              )
            );
          }}
        />
      </div>
    </div>
  );
};
