import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import RoomCard from "../components/RoomCard";
import { Button, Empty, controlClass } from "../components/ui";
import { useApp } from "../context/AppState";
import { CITIES, ROOM_TYPES } from "../lib/constants";
import { liveListings } from "../lib/store";
import { useTitle } from "../lib/useTitle";

export default function Rooms() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  useTitle("Rooms");

  const city = params.get("city") || "";
  const max = params.get("max") || "";
  const type = params.get("type") || "";
  const anmeldung = params.get("anmeldung") === "1";
  const students = params.get("students") === "1";
  const query = (params.get("q") || "").trim().toLowerCase();

  function update(next) {
    const merged = { city, max, type, q: params.get("q") || "", anmeldung: anmeldung ? "1" : "", students: students ? "1" : "", ...next };
    const cleaned = new URLSearchParams();
    Object.entries(merged).forEach(([key, value]) => {
      if (value) cleaned.set(key, value);
    });
    setParams(cleaned);
  }

  const rooms = useMemo(() => {
    return liveListings(state)
      .filter((listing) => (city ? listing.city === city : true))
      .filter((listing) => (type ? listing.type === type : true))
      .filter((listing) => (max ? listing.warmRent <= Number(max) : true))
      .filter((listing) => (anmeldung ? listing.anmeldung : true))
      .filter((listing) => (students ? listing.students : true))
      .filter((listing) => {
        if (!query) return true;
        const haystack = `${listing.title} ${listing.city} ${listing.area}`.toLowerCase();
        return haystack.includes(query);
      })
      .sort((a, b) => a.warmRent - b.warmRent);
  }, [state, city, type, max, anmeldung, students, query]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-xs uppercase tracking-[0.16em] text-brass">The network</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-5xl">Rooms the desk can introduce</h1>
        <Link to="/request" className="text-sm text-pine underline">
          Send a request instead
        </Link>
      </div>
      <p className="mt-3 max-w-2xl text-ink/70">
        These rooms belong to owners who already work with Wohnbrücke. The exact address is shared after a viewing is agreed.
      </p>

      <form className="mt-8 grid gap-3 rounded-3xl border border-ink/10 bg-white p-4 md:grid-cols-4" onSubmit={(event) => event.preventDefault()}>
        <input
          className={controlClass}
          placeholder="Search city or district"
          value={params.get("q") || ""}
          onChange={(event) => update({ q: event.target.value })}
          aria-label="Search"
        />
        <select className={controlClass} value={city} onChange={(event) => update({ city: event.target.value })} aria-label="City">
          <option value="">All cities</option>
          {CITIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select className={controlClass} value={type} onChange={(event) => update({ type: event.target.value })} aria-label="Room type">
          <option value="">Any type</option>
          {ROOM_TYPES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <input
          className={controlClass}
          type="number"
          min="150"
          placeholder="Max warm rent"
          value={max}
          onChange={(event) => update({ max: event.target.value })}
          aria-label="Maximum warm rent"
        />
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" checked={anmeldung} onChange={(event) => update({ anmeldung: event.target.checked ? "1" : "" })} />
          Anmeldung possible
        </label>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" checked={students} onChange={(event) => update({ students: event.target.checked ? "1" : "" })} />
          Students welcome
        </label>
      </form>

      <p className="mt-6 text-sm text-ink/55">{rooms.length} open {rooms.length === 1 ? "room" : "rooms"}</p>
      {rooms.length ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((listing) => (
            <RoomCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <Empty
            title="Nothing open with those filters"
            text="The desk can still take a request for this city and ask the owners directly."
            action={
              <Button onClick={() => navigate(`/request${city ? `?city=${encodeURIComponent(city)}` : ""}`)}>
                Request a room
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
