import { Link, useNavigate, useParams } from "react-router-dom";
import RoomCard from "../components/RoomCard";
import RoomPortrait from "../components/RoomPortrait";
import { Button, ButtonLink, Pill } from "../components/ui";
import { useApp } from "../context/AppState";
import { HOUSEHOLDS, LISTING_STATUSES, ROOM_TYPES, labelOf } from "../lib/constants";
import { availableLabel, euro } from "../lib/format";
import { liveListings } from "../lib/store";
import { useTitle } from "../lib/useTitle";

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, user, toggleSave } = useApp();
  const listing = state.listings.find((item) => item.id === id);
  useTitle(listing ? listing.title : "Room");

  const savedBySeeker = user?.role === "seeker" && listing && user.saved.includes(listing.id);
  const onTheirFile =
    user &&
    listing &&
    state.requests.some(
      (request) => request.userId === user.id && (request.assignedListingId === listing.id || request.listingId === listing.id),
    );
  const canSee =
    listing &&
    (listing.status === "live" ||
      user?.role === "mediator" ||
      (user?.role === "landlord" && user.ownerId === listing.ownerId) ||
      savedBySeeker ||
      onTheirFile);

  if (!canSee) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-serif text-4xl">This room is not on the open list.</h1>
        <p className="mt-3 text-ink/70">It may be reserved, or the desk has taken it offline. A general request still reaches the owners.</p>
        <ButtonLink to="/request" className="mt-6">
          Send a request
        </ButtonLink>
      </div>
    );
  }

  const saved = user?.role === "seeker" && user.saved.includes(listing.id);
  const related = liveListings(state).filter((item) => item.id !== listing.id && item.city === listing.city).slice(0, 3);
  const open = listing.status === "live";

  function onSave() {
    if (!user) {
      navigate("/login", { state: { from: `/rooms/${listing.id}` } });
      return;
    }
    if (user.role !== "seeker") return;
    toggleSave(listing.id);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link to="/rooms" className="text-sm text-ink/55 hover:text-ink">
        All rooms
      </Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <RoomPortrait tone={listing.tone} className="h-72 rounded-[2rem]" />
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Pill status={listing.status}>{labelOf(LISTING_STATUSES, listing.status)}</Pill>
            {listing.anmeldung ? <Pill status="live">Anmeldung</Pill> : <Pill status="closed">No Anmeldung</Pill>}
            {listing.students ? <Pill status="in_review">Students welcome</Pill> : null}
          </div>
          <h1 className="mt-4 font-serif text-5xl leading-tight">{listing.title}</h1>
          <p className="mt-3 text-ink/70">
            {listing.city} · {listing.area} · {labelOf(ROOM_TYPES, listing.type)} · {labelOf(HOUSEHOLDS, listing.household)}
          </p>
          <p className="mt-5 max-w-2xl leading-relaxed text-ink/80">{listing.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {listing.amenities.map((item) => (
              <li key={item} className="rounded-full bg-white px-3 py-1 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <aside className="h-fit rounded-[2rem] border border-ink/10 bg-white p-6 lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-[0.16em] text-brass">Warm rent</p>
          <p className="mt-1 font-serif text-5xl tabular-nums">{euro(listing.warmRent)}</p>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">Basic rent</dt>
              <dd>{euro(listing.coldRent)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">Deposit</dt>
              <dd>{euro(listing.deposit)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">Size</dt>
              <dd>{listing.sqm} m²</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">From</dt>
              <dd>{availableLabel(listing.availableFrom)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-ink/65">
            Listed through Wohnbrücke. The street address stays with the desk until a viewing is agreed.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            {open ? (
              <ButtonLink to={`/request?room=${listing.id}`}>Request this room</ButtonLink>
            ) : (
              <ButtonLink to="/request">Ask the desk for something similar</ButtonLink>
            )}
            {user?.role !== "landlord" && user?.role !== "mediator" ? (
              <Button variant="line" onClick={onSave}>
                {saved ? "Saved to your account" : "Save this room"}
              </Button>
            ) : null}
          </div>
        </aside>
      </div>
      {related.length ? (
        <div className="mt-14">
          <h2 className="font-serif text-3xl">Also in {listing.city}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <RoomCard key={item.id} listing={item} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
