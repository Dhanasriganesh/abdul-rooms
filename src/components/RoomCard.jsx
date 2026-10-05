import { Link } from "react-router-dom";
import RoomPortrait from "./RoomPortrait";
import { labelOf, ROOM_TYPES } from "../lib/constants";
import { availableLabel, euro } from "../lib/format";
import { useApp } from "../context/AppState";

export default function RoomCard({ listing }) {
  const { user, toggleSave } = useApp();
  const saved = user?.role === "seeker" && user.saved.includes(listing.id);

  function onSave(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleSave(listing.id);
  }

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white">
      <RoomPortrait tone={listing.tone} className="h-40" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-3 text-xs text-ink/55">
          <span>
            {listing.city} · {listing.area}
          </span>
          <span>{labelOf(ROOM_TYPES, listing.type)}</span>
        </div>
        <h3 className="mt-2 font-serif text-[1.65rem] leading-tight">
          <Link to={`/rooms/${listing.id}`} className="after:absolute after:inset-0 after:content-[''] hover:text-pine">
            {listing.title}
          </Link>
        </h3>
        <p className="mt-3 text-sm text-ink/65">
          {listing.sqm} m² · {availableLabel(listing.availableFrom)}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="tabular-nums">
            <span className="font-medium">{euro(listing.warmRent)}</span>
            <span className="text-ink/50"> warm</span>
          </p>
          <div className="relative z-10 flex items-center gap-2">
            {listing.anmeldung ? <span className="text-xs font-medium text-pine">Anmeldung</span> : null}
            {user?.role === "seeker" ? (
              <button
                type="button"
                onClick={onSave}
                className={`rounded-full border px-3 py-1 text-xs ${saved ? "border-pine bg-pine text-paper" : "border-ink/15 bg-white"}`}
                aria-pressed={saved}
              >
                {saved ? "Saved" : "Save"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
