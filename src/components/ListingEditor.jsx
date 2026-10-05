import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Field, controlClass } from "./ui";
import { useApp } from "../context/AppState";
import { AMENITIES, CITIES, HOUSEHOLDS, LISTING_STATUSES, ROOM_TYPES } from "../lib/constants";

const blank = {
  title: "",
  city: "Berlin",
  area: "",
  type: "wg",
  sqm: "",
  warmRent: "",
  coldRent: "",
  deposit: "",
  availableFrom: "",
  furnished: true,
  anmeldung: true,
  students: true,
  household: "mixed",
  amenities: ["Kitchen", "Wi-Fi"],
  description: "",
  tone: "pine",
  status: "pending",
};

export default function ListingEditor({ listingId, desk = false }) {
  const { state, user, saveRoom, notify } = useApp();
  const navigate = useNavigate();
  const existing = state.listings.find((item) => item.id === listingId);
  const [values, setValues] = useState(() =>
    existing
      ? { ...existing }
      : { ...blank, status: desk ? "live" : "pending", ownerId: user.ownerId || state.owners[0]?.id || "" },
  );
  const [error, setError] = useState("");

  if (listingId && !existing) {
    return <p>That room is not on file.</p>;
  }
  if (!desk && existing && existing.ownerId !== user.ownerId) {
    return <p>This room belongs to another owner.</p>;
  }

  function set(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function toggleAmenity(item) {
    setValues((current) => ({
      ...current,
      amenities: current.amenities.includes(item)
        ? current.amenities.filter((entry) => entry !== item)
        : [...current.amenities, item],
    }));
  }

  function onSubmit(event) {
    event.preventDefault();
    if (!values.title.trim() || !values.area.trim() || !values.sqm || !values.warmRent || !values.availableFrom) {
      setError("Title, district, size, warm rent, and a date are required.");
      return;
    }
    const cold = Number(values.coldRent) || Math.round(Number(values.warmRent) * 0.78);
    const payload = {
      ...values,
      title: values.title.trim(),
      area: values.area.trim(),
      sqm: Number(values.sqm),
      warmRent: Number(values.warmRent),
      coldRent: cold,
      deposit: Number(values.deposit) || cold * 3,
      ownerId: desk ? values.ownerId : user.ownerId,
      status: desk ? values.status : existing?.status || "pending",
      description: values.description.trim(),
    };
    saveRoom(payload);
    notify(existing ? "Room updated." : "Room sent to the desk.");
    navigate(desk ? "/desk/rooms" : "/portal/listings");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <h1 className="font-serif text-4xl">{existing ? "Edit room" : "New room"}</h1>
      {desk ? (
        <Field label="Owner">
          <select className={controlClass} value={values.ownerId} onChange={(event) => set("ownerId", event.target.value)}>
            {state.owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} · {owner.city}
              </option>
            ))}
          </select>
        </Field>
      ) : (
        <p className="text-sm text-ink/65">
          {existing ? "Changes stay on the current status." : "A new room waits for the desk before it appears publicly."}
        </p>
      )}
      <Field label="Title">
        <input className={controlClass} value={values.title} onChange={(event) => set("title", event.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City">
          <select className={controlClass} value={values.city} onChange={(event) => set("city", event.target.value)}>
            {CITIES.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </Field>
        <Field label="District">
          <input className={controlClass} value={values.area} onChange={(event) => set("area", event.target.value)} />
        </Field>
        <Field label="Type">
          <select className={controlClass} value={values.type} onChange={(event) => set("type", event.target.value)}>
            {ROOM_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Household">
          <select className={controlClass} value={values.household} onChange={(event) => set("household", event.target.value)}>
            {HOUSEHOLDS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Size, m²">
          <input className={controlClass} type="number" min="6" value={values.sqm} onChange={(event) => set("sqm", event.target.value)} />
        </Field>
        <Field label="Warm rent €">
          <input className={controlClass} type="number" min="100" value={values.warmRent} onChange={(event) => set("warmRent", event.target.value)} />
        </Field>
        <Field label="Basic rent €" hint="Leave blank to estimate from the warm rent.">
          <input className={controlClass} type="number" min="0" value={values.coldRent} onChange={(event) => set("coldRent", event.target.value)} />
        </Field>
        <Field label="Deposit €" hint="Usually up to three months of basic rent.">
          <input className={controlClass} type="number" min="0" value={values.deposit} onChange={(event) => set("deposit", event.target.value)} />
        </Field>
        <Field label="Available from">
          <input className={controlClass} type="date" value={values.availableFrom} onChange={(event) => set("availableFrom", event.target.value)} />
        </Field>
        {desk ? (
          <Field label="Status">
            <select className={controlClass} value={values.status} onChange={(event) => set("status", event.target.value)}>
              {LISTING_STATUSES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={values.furnished} onChange={(event) => set("furnished", event.target.checked)} />
          Furnished
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={values.anmeldung} onChange={(event) => set("anmeldung", event.target.checked)} />
          Anmeldung possible
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={values.students} onChange={(event) => set("students", event.target.checked)} />
          Students welcome
        </label>
      </div>
      <Field label="In the room">
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((item) => {
            const on = values.amenities.includes(item);
            return (
              <button
                key={item}
                type="button"
                aria-pressed={on}
                onClick={() => toggleAmenity(item)}
                className={`rounded-full border px-3 py-1.5 text-sm ${on ? "border-pine bg-pine text-paper" : "border-ink/15 bg-white"}`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </Field>
      <Field label="Description">
        <textarea className={`${controlClass} min-h-28`} value={values.description} onChange={(event) => set("description", event.target.value)} />
      </Field>
      {error ? <p className="text-sm text-copper">{error}</p> : null}
      <Button type="submit">{existing ? "Save room" : "Add room"}</Button>
    </form>
  );
}
