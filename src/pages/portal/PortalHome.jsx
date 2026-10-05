import { Link } from "react-router-dom";
import { useApp } from "../../context/AppState";
import { LISTING_STATUSES, labelOf } from "../../lib/constants";
import { requestsForOwner } from "../../lib/store";
import { useTitle } from "../../lib/useTitle";

export default function PortalHome() {
  const { state, user } = useApp();
  useTitle("Owner portal");
  const rooms = state.listings.filter((listing) => listing.ownerId === user.ownerId);
  const inquiries = requestsForOwner(state, user.ownerId);
  const owner = state.owners.find((item) => item.id === user.ownerId);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-brass">Owner</p>
      <h1 className="mt-2 font-serif text-4xl">{owner?.name || user.name}</h1>
      <p className="mt-2 max-w-xl text-ink/70">
        Rooms you send sit with the desk until they are published. Inquiries appear here once a request points at one of your rooms.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Rooms on file", rooms.length],
          ["Open to the public", rooms.filter((room) => room.status === "live").length],
          ["Inquiries", inquiries.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-white p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-ink/45">{label}</p>
            <p className="mt-2 font-serif text-3xl">{value}</p>
          </div>
        ))}
      </div>
      <ul className="mt-8 divide-y divide-ink/10 rounded-3xl bg-white px-4">
        {rooms.slice(0, 4).map((room) => (
          <li key={room.id} className="flex items-center justify-between gap-3 py-3 text-sm">
            <Link to={`/portal/listings/${room.id}`} className="font-medium hover:text-pine">
              {room.title}
            </Link>
            <span className="text-ink/55">{labelOf(LISTING_STATUSES, room.status)}</span>
          </li>
        ))}
      </ul>
      <Link to="/portal/listings/new" className="mt-5 inline-flex rounded-full bg-pine px-4 py-2.5 text-sm text-paper">
        Add a room
      </Link>
    </div>
  );
}
