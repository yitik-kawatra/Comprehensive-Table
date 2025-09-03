import React from "react";
import "./App.css";
import { Table } from "./components/Table/Table";
import type { Column } from "./components/Table/types";

type Row = {
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

const columns: Column<Row>[] = [
  {
    title: "Name",
    key: "name",
    width: 180,
    type: "text",
  },
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
    render: (v) => {
      let badgeClass = "bg-gray-100 text-gray-700";
      if (v === "Active") badgeClass = "bg-green-50 text-green-700";
      else if (v === "Terminated") badgeClass = "bg-red-50 text-red-700";
      else if (v === "Expired") badgeClass = "bg-orange-50 text-orange-700";
      return (
        <span
          className={`inline-block min-w-[70px] text-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
          style={{
            letterSpacing: 0.1,
            border: "1px solid transparent",
          }}
        >
          {v}
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
      <a href={`mailto:${email}`} style={{ color: "#2563eb", textDecoration: "underline" }}>
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
      <a href={website} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
        {website.replace(/^https?:\/\//, "")}
      </a>
    ),
  },
  {
    title: "Age",
    key: "age",
    width: 80,
    type: "number",
    filterable: true,
  },
  {
    title: "Active",
    key: "active",
    width: 100,
    type: "boolean",
    filterable: true,
  },
  {
    title: "Join Date",
    key: "joinDate",
    width: 140,
    type: "date",
  },
  {
    title: "Profile",
    key: "profile",
    width: 180,
    type: "link",
    render: (profileUrl) => (
      <a href={profileUrl} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
        View Profile
      </a>
    ),
  },
];

const randomFrom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start: Date, end: Date) => {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().slice(0, 10);
};
const makeRows = (n = 200): Row[] =>
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
    const statuses: Row["status"][] = ["Active", "Terminated", "Expired"];
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

function App() {
   const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setRows(makeRows());
      setLoading(false);
    }, 600);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Table Component Demo</h1>
      <Table<Row>
        columns={columns}
        data={rows}
        loading={loading}
        resizable
        stickyHeader
        searchable
        sortable
        onCellEdit={(rowIdx, key, value) => {
          setRows((rows) =>
            rows.map((row, index) =>
              index === rowIdx ? { ...row, [key]: value } : row
            )
          );
        }}
      />
    </div>
  );
}

export default App;
