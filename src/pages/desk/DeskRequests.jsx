import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataTable, Pill, controlClass } from "../../components/ui";
import { useApp } from "../../context/AppState";
import { REQUEST_STATUSES, statusLabel } from "../../lib/constants";
import { euro, shortDate } from "../../lib/format";
import { useTitle } from "../../lib/useTitle";

export default function DeskRequests() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(params.get("status") || "");
  useTitle("Requests");
  const seeker = params.get("seeker") || "";

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return state.requests.filter((request) => {
      if (status && request.status !== status) return false;
      if (seeker && request.userId !== seeker) return false;
      if (!needle) return true;
      return `${request.name} ${request.email} ${request.cities.join(" ")}`.toLowerCase().includes(needle);
    });
  }, [state.requests, query, status, seeker]);

  return (
    <div>
      <h1 className="font-serif text-4xl">Requests</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input className={controlClass} placeholder="Name, email, city" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className={controlClass} value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Every status</option>
          {REQUEST_STATUSES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <DataTable
          rows={rows}
          onRow={(row) => navigate(`/desk/requests/${row.id}`)}
          columns={[
            { key: "name", label: "Person", render: (row) => row.name },
            { key: "cities", label: "Cities", render: (row) => row.cities.join(", ") },
            { key: "budget", label: "Budget", render: (row) => euro(row.budget) },
            { key: "when", label: "Sent", render: (row) => shortDate(row.createdAt) },
            { key: "status", label: "Status", render: (row) => <Pill status={row.status}>{statusLabel(row.status)}</Pill> },
          ]}
        />
      </div>
      {!rows.length ? <p className="mt-4 text-sm text-ink/60">No request matches.</p> : null}
    </div>
  );
}
