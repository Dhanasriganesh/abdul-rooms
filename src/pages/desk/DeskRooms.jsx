import { useNavigate } from "react-router-dom";
import { DataTable, Pill } from "../../components/ui";
import { useApp } from "../../context/AppState";
import { LISTING_STATUSES, labelOf } from "../../lib/constants";
import { euro } from "../../lib/format";
import { useTitle } from "../../lib/useTitle";

export default function DeskRooms() {
  const { state, saveRoom, notify } = useApp();
  const navigate = useNavigate();
  useTitle("Rooms");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-serif text-4xl">Rooms</h1>
        <button type="button" className="rounded-full bg-pine px-4 py-2 text-sm text-paper" onClick={() => navigate("/desk/rooms/new")}>
          Add a room
        </button>
      </div>
      <div className="mt-5">
        <DataTable
          rows={state.listings}
          onRow={(row) => navigate(`/desk/rooms/${row.id}`)}
          columns={[
            { key: "title", label: "Room", render: (row) => row.title },
            { key: "where", label: "Where", render: (row) => `${row.city} · ${row.area}` },
            {
              key: "owner",
              label: "Owner",
              render: (row) => state.owners.find((owner) => owner.id === row.ownerId)?.name || "—",
            },
            { key: "rent", label: "Warm", render: (row) => euro(row.warmRent) },
            {
              key: "status",
              label: "Status",
              render: (row) => (
                <select
                  className="rounded-full border border-ink/10 bg-white px-2 py-1 text-xs"
                  value={row.status}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => {
                    event.stopPropagation();
                    saveRoom({ ...row, status: event.target.value });
                    notify(`${row.area} is now ${labelOf(LISTING_STATUSES, event.target.value).toLowerCase()}.`);
                  }}
                >
                  {LISTING_STATUSES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              ),
            },
          ]}
        />
      </div>
      <p className="mt-3 text-xs text-ink/45">
        Open rooms are public. With the desk, reserved, let, and offline stay on the file. <Pill status="live">Open</Pill>
      </p>
    </div>
  );
}
