import { useNavigate } from "react-router-dom";
import { DataTable, Empty, Pill } from "../../components/ui";
import { useApp } from "../../context/AppState";
import { statusLabel } from "../../lib/constants";
import { euro, shortDate } from "../../lib/format";
import { requestsForUser } from "../../lib/store";
import { useTitle } from "../../lib/useTitle";

export default function Requests() {
  const { state, user } = useApp();
  const navigate = useNavigate();
  const rows = requestsForUser(state, user);
  useTitle("Requests");

  if (!rows.length) {
    return (
      <Empty
        title="No requests yet"
        text="The form takes a few minutes. The desk answers on the same file."
        action={
          <button type="button" className="rounded-full bg-pine px-4 py-2 text-sm text-paper" onClick={() => navigate("/request")}>
            Request a room
          </button>
        }
      />
    );
  }

  return (
    <div>
      <h1 className="font-serif text-4xl">Requests</h1>
      <div className="mt-5">
        <DataTable
          rows={rows}
          onRow={(row) => navigate(`/account/requests/${row.id}`)}
          columns={[
            { key: "when", label: "Sent", render: (row) => shortDate(row.createdAt) },
            { key: "where", label: "Cities", render: (row) => row.cities.join(", ") },
            { key: "budget", label: "Budget", render: (row) => euro(row.budget) },
            { key: "status", label: "Status", render: (row) => <Pill status={row.status}>{statusLabel(row.status)}</Pill> },
          ]}
        />
      </div>
    </div>
  );
}
