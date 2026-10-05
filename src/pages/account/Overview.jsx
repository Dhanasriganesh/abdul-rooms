import { Link } from "react-router-dom";
import { Pill } from "../../components/ui";
import RoomCard from "../../components/RoomCard";
import { useApp } from "../../context/AppState";
import { statusLabel } from "../../lib/constants";
import { euro } from "../../lib/format";
import { liveListings, requestsForUser } from "../../lib/store";
import { useTitle } from "../../lib/useTitle";

export default function Overview() {
  const { state, user } = useApp();
  useTitle("Your account");
  const requests = requestsForUser(state, user);
  const open = requests.filter((request) => !["placed", "closed"].includes(request.status));
  const referrals = state.referrals.filter((item) => item.referrerId === user.id);
  const ready = referrals.filter((item) => item.status === "earned").reduce((sum, item) => sum + item.amount, 0);
  const cities = new Set(requests.flatMap((request) => request.cities).concat(user.city || []));
  const budget = Number(user.budget) || Math.max(0, ...requests.map((request) => Number(request.budget) || 0));
  const suggested = liveListings(state)
    .filter((listing) => !cities.size || cities.has(listing.city))
    .filter((listing) => !budget || listing.warmRent <= budget + 80)
    .slice(0, 3);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-brass">Resident</p>
      <h1 className="mt-2 font-serif text-4xl">Hello, {user.name.split(" ")[0]}</h1>
      <p className="mt-2 max-w-xl text-ink/70">Your requests, saved rooms, and referral thank-yous live here.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Open requests", open.length],
          ["Saved rooms", user.saved.length],
          ["Thank-you waiting", euro(ready)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-white p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-ink/45">{label}</p>
            <p className="mt-2 font-serif text-3xl">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Latest request</h2>
          <Link to="/request" className="text-sm text-pine underline">
            New request
          </Link>
        </div>
        {requests[0] ? (
          <Link to={`/account/requests/${requests[0].id}`} className="mt-3 block rounded-3xl border border-ink/10 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{requests[0].cities.join(", ")}</p>
              <Pill status={requests[0].status}>{statusLabel(requests[0].status)}</Pill>
            </div>
            <p className="mt-2 text-sm text-ink/60">Up to {euro(requests[0].budget)} · move-in {requests[0].moveIn}</p>
          </Link>
        ) : (
          <p className="mt-3 text-sm text-ink/60">No request yet.</p>
        )}
      </div>
      {suggested.length ? (
        <div className="mt-8">
          <h2 className="font-serif text-2xl">Rooms near your file</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {suggested.map((listing) => (
              <RoomCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
