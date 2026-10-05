import { useState } from "react";
import { Button, DataTable, Field, Panel, Pill, controlClass } from "../../components/ui";
import { useApp } from "../../context/AppState";
import { CITIES } from "../../lib/constants";
import { shortDate } from "../../lib/format";
import { useTitle } from "../../lib/useTitle";

const blank = { name: "", email: "", phone: "", city: "Berlin", notes: "" };

export default function DeskOwners() {
  const { state, createOwner, updateLead, notify } = useApp();
  const [values, setValues] = useState(blank);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);
  useTitle("Owners");

  function onSubmit(event) {
    event.preventDefault();
    const result = createOwner(values);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError("");
    setCreated(result.user);
    setValues(blank);
    notify("Owner login created.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl">Owners</h1>
        <p className="mt-2 text-sm text-ink/65">People who asked the desk to fill a room. A login lets them add listings themselves.</p>
      </div>
      <DataTable
        rows={state.owners}
        columns={[
          { key: "name", label: "Name", render: (row) => row.name },
          { key: "city", label: "City", render: (row) => row.city },
          { key: "rooms", label: "Rooms", render: (row) => state.listings.filter((listing) => listing.ownerId === row.id).length },
          { key: "login", label: "Login", render: (row) => (row.userId ? row.email : "Desk only") },
          { key: "since", label: "Since", render: (row) => shortDate(row.createdAt) },
        ]}
      />

      <Panel>
        <h2 className="font-serif text-2xl">Add an owner login</h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2" noValidate>
          <Field label="Name">
            <input className={controlClass} value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} />
          </Field>
          <Field label="Email">
            <input className={controlClass} type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} />
          </Field>
          <Field label="Phone">
            <input className={controlClass} value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} />
          </Field>
          <Field label="City">
            <select className={controlClass} value={values.city} onChange={(event) => setValues({ ...values, city: event.target.value })}>
              {CITIES.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </Field>
          <Field label="Notes">
            <input className={controlClass} value={values.notes} onChange={(event) => setValues({ ...values, notes: event.target.value })} />
          </Field>
          <div className="flex items-end">
            <Button type="submit">Create login</Button>
          </div>
        </form>
        {error ? <p className="mt-3 text-sm text-copper">{error}</p> : null}
        {created ? (
          <p className="mt-3 text-sm">
            {created.name} can log in as {created.email} with password bruecke.
          </p>
        ) : null}
      </Panel>

      <section>
        <h2 className="font-serif text-2xl">Notes from the website</h2>
        <div className="mt-4 space-y-3">
          {state.leads.map((lead) => (
            <article key={lead.id} className="rounded-3xl bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-ink/60">
                    {lead.city} · {lead.roomCount} rooms · {lead.email} · {lead.phone}
                  </p>
                </div>
                <Pill status={lead.status}>{lead.status}</Pill>
              </div>
              {lead.message ? <p className="mt-2 text-sm">{lead.message}</p> : null}
              <div className="mt-3 flex gap-2">
                <Button variant="line" onClick={() => updateLead(lead.id, "contacted")}>
                  Mark contacted
                </Button>
                <Button variant="ghost" onClick={() => updateLead(lead.id, "declined")}>
                  Decline
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
