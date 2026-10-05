import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Field, Panel, controlClass } from "../components/ui";
import { useApp } from "../context/AppState";
import { CITIES } from "../lib/constants";
import { useTitle } from "../lib/useTitle";

const blank = { name: "", email: "", phone: "", city: "Berlin", roomCount: "1", message: "" };

export default function ForOwners() {
  const { createLead, notify } = useApp();
  const [values, setValues] = useState(blank);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  useTitle("For owners");

  function set(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function onSubmit(event) {
    event.preventDefault();
    if (!values.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.phone.trim().length < 6) {
      setError("Name, a valid email, and a phone number let the desk call you back.");
      return;
    }
    createLead(values);
    setSent(true);
    setError("");
    notify("The desk has your note.");
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-brass">House owners</p>
          <h1 className="mt-2 font-serif text-5xl leading-tight">Send the room. The desk finds the tenant.</h1>
          <p className="mt-4 max-w-xl text-lg text-ink/75">
            Wohnbrücke already knows your file. A new room is checked, then shown to people who asked for that city and budget. You are not asked to answer every message yourself.
          </p>
          <ul className="mt-8 space-y-4 text-sm leading-relaxed text-ink/75">
            <li>Your phone stays off the public room card.</li>
            <li>Inquiries arrive in the owner portal once a room is linked.</li>
            <li>Contact details open when a viewing is agreed.</li>
            <li>You can add a listing yourself after creating an owner login.</li>
          </ul>
          <Link to="/register?as=landlord" className="mt-8 inline-flex text-sm text-pine underline">
            Create an owner login
          </Link>
        </div>
        <Panel>
          {sent ? (
            <div>
              <h2 className="font-serif text-3xl">The desk will call.</h2>
              <p className="mt-3 text-sm text-ink/70">
                Your note is on the mediator desk. If you want to add rooms yourself, open an owner login with the same email.
              </p>
              <Link to="/register?as=landlord" className="mt-5 inline-flex rounded-full bg-pine px-4 py-2.5 text-sm text-paper">
                Open an owner login
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <h2 className="font-serif text-3xl">Ask for a conversation</h2>
              <Field label="Name">
                <input className={controlClass} value={values.name} onChange={(event) => set("name", event.target.value)} />
              </Field>
              <Field label="Email">
                <input className={controlClass} type="email" value={values.email} onChange={(event) => set("email", event.target.value)} />
              </Field>
              <Field label="Phone">
                <input className={controlClass} value={values.phone} onChange={(event) => set("phone", event.target.value)} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City">
                  <select className={controlClass} value={values.city} onChange={(event) => set("city", event.target.value)}>
                    {CITIES.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Rooms to fill">
                  <input className={controlClass} value={values.roomCount} onChange={(event) => set("roomCount", event.target.value)} />
                </Field>
              </div>
              <Field label="What should the desk know?">
                <textarea className={`${controlClass} min-h-24`} value={values.message} onChange={(event) => set("message", event.target.value)} />
              </Field>
              {error ? <p className="text-sm text-copper">{error}</p> : null}
              <Button type="submit">Send to the desk</Button>
            </form>
          )}
        </Panel>
      </div>
    </div>
  );
}
