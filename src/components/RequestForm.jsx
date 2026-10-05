import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppState";
import { CITIES, OCCUPATIONS, SMOKING, STAYS, ROOM_TYPES } from "../lib/constants";
import { referenceFor } from "../lib/format";
import { Button, Field, Panel, controlClass } from "./ui";

const empty = {
  name: "",
  email: "",
  phone: "",
  occupation: "student",
  institution: "",
  cities: [],
  budget: "",
  moveIn: "",
  stay: "6–12 months",
  roomType: "wg",
  germanLevel: "",
  smoking: "no",
  pets: false,
  anmeldung: true,
  proof: false,
  notes: "",
  referralCode: "",
};

function validate(values, referralOk) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email.";
  if (values.phone.trim().length < 6) errors.phone = "Enter a phone or WhatsApp number.";
  if (!values.cities.length) errors.cities = "Choose at least one city.";
  if (!values.budget || Number(values.budget) < 150) errors.budget = "Enter a monthly warm-rent budget.";
  if (!values.moveIn) errors.moveIn = "Choose a move-in date.";
  if (!values.stay) errors.stay = "Choose how long you want to stay.";
  if (values.referralCode && !referralOk) errors.referralCode = "That code is not active. Clear it to send the request anyway.";
  return errors;
}

export default function RequestForm({ listing, presetCity = "", presetCode = "" }) {
  const { user, state, sendRequest } = useApp();
  const navigate = useNavigate();
  const [values, setValues] = useState(() => ({
    ...empty,
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    occupation: user?.occupation || "student",
    institution: user?.institution || "",
    cities: presetCity ? [presetCity] : user?.city ? [user.city] : [],
    budget: user?.budget || "",
    germanLevel: user?.germanLevel || "",
    referralCode: user?.referredBy || presetCode || "",
  }));
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);

  function set(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function toggleCity(city) {
    setValues((current) => ({
      ...current,
      cities: current.cities.includes(city) ? current.cities.filter((item) => item !== city) : [...current.cities, city],
    }));
  }

  const referralOk =
    !values.referralCode.trim() ||
    state.users.some(
      (item) => item.role === "seeker" && item.referralCode === values.referralCode.trim().toUpperCase() && item.id !== user?.id,
    );

  function onSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values, referralOk);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const result = sendRequest({ ...values, listingId: listing?.id || "" });
    setDone(result.request);
  }

  if (done) {
    return (
      <Panel>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brass">Request received</p>
        <h2 className="mt-2 font-serif text-4xl">The desk has your file.</h2>
        <p className="mt-3 max-w-xl text-ink/70">
          Reference <span className="font-medium text-ink">{referenceFor(done.id)}</span>. A coordinator
          matches this against owners already working with Wohnbrücke. You will hear by email or phone. The landlord's number
          stays with the desk until a viewing is agreed.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {user ? <Button onClick={() => navigate("/account/requests")}>Track this request</Button> : null}
          {!user ? (
            <Button onClick={() => navigate(`/register?email=${encodeURIComponent(done.email)}`)}>
              Create an account to follow it
            </Button>
          ) : null}
          <Button variant="line" onClick={() => navigate("/rooms")}>
            Browse rooms
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {listing ? (
        <Panel className="bg-paper">
          <p className="text-xs uppercase tracking-[0.16em] text-brass">Preferred room</p>
          <p className="mt-1 font-serif text-2xl">{listing.title}</p>
          <p className="text-sm text-ink/60">
            {listing.city} · {listing.area}. The desk can still offer a closer match.
          </p>
        </Panel>
      ) : null}

      <Panel>
        <h2 className="font-serif text-3xl">About you</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={errors.name}>
            <input className={controlClass} value={values.name} onChange={(event) => set("name", event.target.value)} autoComplete="name" />
          </Field>
          <Field label="Email" error={errors.email}>
            <input className={controlClass} type="email" value={values.email} onChange={(event) => set("email", event.target.value)} autoComplete="email" />
          </Field>
          <Field label="Phone or WhatsApp" error={errors.phone} hint="The desk uses this to arrange a viewing.">
            <input className={controlClass} value={values.phone} onChange={(event) => set("phone", event.target.value)} autoComplete="tel" />
          </Field>
          <Field label="I am">
            <select className={controlClass} value={values.occupation} onChange={(event) => set("occupation", event.target.value)}>
              {OCCUPATIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="University or workplace" hint="Optional, and useful for a match.">
            <input className={controlClass} value={values.institution} onChange={(event) => set("institution", event.target.value)} />
          </Field>
        </div>
      </Panel>

      <Panel>
        <h2 className="font-serif text-3xl">The room</h2>
        <div className="mt-5">
          <Field label="Cities" error={errors.cities}>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((city) => {
                const on = values.cities.includes(city);
                return (
                  <button
                    key={city}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleCity(city)}
                    className={`rounded-full border px-3 py-1.5 text-sm ${on ? "border-pine bg-pine text-paper" : "border-ink/15 bg-white"}`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Monthly budget, warm rent" error={errors.budget} hint="Warmmiete, including typical running costs.">
            <input className={controlClass} type="number" min="150" step="10" value={values.budget} onChange={(event) => set("budget", event.target.value)} />
          </Field>
          <Field label="Move-in date" error={errors.moveIn}>
            <input className={controlClass} type="date" value={values.moveIn} onChange={(event) => set("moveIn", event.target.value)} />
          </Field>
          <Field label="How long" error={errors.stay}>
            <select className={controlClass} value={values.stay} onChange={(event) => set("stay", event.target.value)}>
              {STAYS.map((stay) => (
                <option key={stay}>{stay}</option>
              ))}
            </select>
          </Field>
          <Field label="Room type">
            <select className={controlClass} value={values.roomType} onChange={(event) => set("roomType", event.target.value)}>
              <option value="any">Open to any</option>
              {ROOM_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="German" hint="Optional.">
            <select className={controlClass} value={values.germanLevel} onChange={(event) => set("germanLevel", event.target.value)}>
              <option value="">Not specified</option>
              {["None yet", "A1", "A2", "B1", "B2", "C1", "C2", "Native"].map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </Field>
          <Field label="Smoking">
            <select className={controlClass} value={values.smoking} onChange={(event) => set("smoking", event.target.value)}>
              {SMOKING.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked={values.anmeldung} onChange={(event) => set("anmeldung", event.target.checked)} />
            <span>I need Anmeldung at the address.</span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked={values.proof} onChange={(event) => set("proof", event.target.checked)} />
            <span>I can share enrolment, income, or a SCHUFA statement when a room is offered.</span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked={values.pets} onChange={(event) => set("pets", event.target.checked)} />
            <span>I have a pet.</span>
          </label>
        </div>
      </Panel>

      <Panel>
        <h2 className="font-serif text-3xl">Anything the desk should know</h2>
        <div className="mt-5 space-y-4">
          <Field label="Note" hint="Hours you can view, a partner joining you, a district you want.">
            <textarea className={`${controlClass} min-h-28`} value={values.notes} onChange={(event) => set("notes", event.target.value)} />
          </Field>
          {user?.referredBy ? (
            <p className="text-sm text-ink/65">
              You joined with referral <span className="font-medium text-ink">{user.referredBy}</span>.
            </p>
          ) : (
            <Field label="Referral code" error={errors.referralCode} hint="Optional. Your friend receives €75 when you move into a room from the network.">
              <input
                className={controlClass}
                value={values.referralCode}
                onChange={(event) => set("referralCode", event.target.value.toUpperCase())}
                placeholder="MAYA-19"
              />
            </Field>
          )}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button type="submit">Send request</Button>
          <p className="max-w-md text-xs text-ink/55">
            Seekers pay no broker fee. The owner who asks Wohnbrücke to fill the room covers the mediation.{" "}
            <Link to="/how-it-works" className="underline">
              How a file moves
            </Link>
            .
          </p>
        </div>
      </Panel>
    </form>
  );
}
