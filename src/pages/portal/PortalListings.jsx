import { Link, useNavigate } from "react-router-dom";
import { DataTable, Pill } from "../../components/ui";
import { useApp } from "../../context/AppState";
import { LISTING_STATUSES, labelOf } from "../../lib/constants";
import { euro } from "../../lib/format";
import { useTitle } from "../../lib/useTitle";

export default function PortalListings() {
  const { state, user } = useApp();
  const navigate = useNavigate();
  const rows = state.listings.filter((listing) => listing.ownerId === user.ownerId);
  useTitle("Your rooms");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-serif text-4xl">Your rooms</h1>
        <Link to="/portal/listings/new" className="rounded-full bg-pine px-4 py-2 text-sm text-paper">
          Add a room
        </Link>
      </div>
      <div className="mt-5">
        <DataTable
          rows={rows}
          onRow={(row) => navigate(`/portal/listings/${row.id}`)}
          columns={[
            { key: "title", label: "Room", render: (row) => row.title },
            { key: "area", label: "District", render: (row) => `${row.area}` },
            { key: "rent", label: "Warm", render: (row) => euro(row.warmRent) },
            { key: "status", label: "Status", render: (row) => <Pill status={row.status}>{labelOf(LISTING_STATUSES, row.status)}</Pill> },
          ]}
        />
      </div>
    </div>
  );
}
