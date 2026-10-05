import { Link } from "react-router-dom";
import { useApp } from "../../context/AppState";
import { statusLabel } from "../../lib/constants";
import { liveListings } from "../../lib/store";
import { useTitle } from "../../lib/useTitle";

export default function DeskHome() {
  const { state, resetDemo } = useApp();
  useTitle("Mediator desk");
  const openRequests = state.requests.filter((request) => !["placed", "closed"].includes(request.status));
  const pendingRooms = state.listings.filter((listing) => listing.status === "pending");
  const earned = state.referrals.filter((item) => item.status === "earned");
  const newLeads = state.leads.filter((lead) => lead.status === "new");

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-brass">Mediator</p>
      <h1 className="mt-2 font-serif text-4xl">The desk</h1>
      <p className="mt-2 max-w-xl text-ink/70">
        Match requests to owners, publish rooms, and record referral payouts. Sample data can be restored if a walkthrough gets tangled.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Open requests", openRequests.length, "/desk/requests"],
          ["Rooms live", liveListings(state).length, "/desk/rooms"],
          ["Rooms to check", pendingRooms.length, "/desk/rooms"],
          ["Payouts to record", earned.length, "/desk/referrals"],
        ].map(([label, value, to]) => (
          <Link key={label} to={to} className="rounded-3xl bg-white p-4 hover:border-pine">
            <p className="text-xs uppercase tracking-[0.14em] text-ink/45">{label}</p>
            <p className="mt-2 font-serif text-3xl">{value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-5">
          <h2 className="font-serif text-2xl">Newest requests</h2>
          <ul className="mt-3 divide-y divide-ink/10">
            {state.requests.slice(0, 4).map((request) => (
              <li key={request.id}>
                <Link to={`/desk/requests/${request.id}`} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span>{request.name}</span>
                  <span className="text-ink/55">{statusLabel(request.status)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl bg-white p-5">
          <h2 className="font-serif text-2xl">Owner notes</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {newLeads.length ? (
              newLeads.map((lead) => (
                <li key={lead.id}>
                  <Link to="/desk/owners" className="font-medium">
                    {lead.name}
                  </Link>
                  <p className="text-ink/60">
                    {lead.city} · {lead.roomCount} rooms
                  </p>
                </li>
              ))
            ) : (
              <li className="text-ink/60">No new owner notes.</li>
            )}
          </ul>
          <button type="button" onClick={resetDemo} className="mt-6 text-sm underline">
            Restore sample data
          </button>
        </section>
      </div>
    </div>
  );
}
