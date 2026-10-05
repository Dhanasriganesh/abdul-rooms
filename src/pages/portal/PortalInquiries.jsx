import { useState } from "react";
import { Button, Pill } from "../../components/ui";
import { useApp } from "../../context/AppState";
import { statusLabel } from "../../lib/constants";
import { euro } from "../../lib/format";
import { requestsForOwner } from "../../lib/store";
import { useTitle } from "../../lib/useTitle";

const revealed = new Set(["viewing", "offered", "placed"]);

export default function PortalInquiries() {
  const { state, user, noteFromOwner, notify } = useApp();
  const rows = requestsForOwner(state, user.ownerId);
  useTitle("Inquiries");

  return (
    <div>
      <h1 className="font-serif text-4xl">Inquiries</h1>
      <p className="mt-2 max-w-xl text-sm text-ink/65">
        Phone and email open once the desk has agreed a viewing. Until then you see the fit, not the contact line.
      </p>
      <div className="mt-6 space-y-4">
        {rows.length ? (
          rows.map((request) => (
            <Inquiry key={request.id} request={request} state={state} onNote={(note) => {
              noteFromOwner(request.id, note);
              notify("Note sent to the desk.");
            }} />
          ))
        ) : (
          <p className="rounded-3xl bg-white px-4 py-8 text-sm text-ink/60">No inquiry is linked to your rooms yet.</p>
        )}
      </div>
    </div>
  );
}

function Inquiry({ request, state, onNote }) {
  const [note, setNote] = useState(request.landlordNote || "");
  const listing = state.listings.find((item) => item.id === (request.assignedListingId || request.listingId));
  const open = revealed.has(request.status);
  return (
    <article className="rounded-3xl bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl">{request.name.split(" ")[0]}</h2>
        <Pill status={request.status}>{statusLabel(request.status)}</Pill>
      </div>
      <p className="mt-2 text-sm text-ink/70">
        {listing ? listing.title : "Room not set"} · budget {euro(request.budget)} · {request.cities.join(", ")}
      </p>
      <p className="mt-3 text-sm leading-relaxed">{request.notes || "No extra note."}</p>
      {open ? (
        <p className="mt-3 text-sm">
          {request.email} · {request.phone}
        </p>
      ) : (
        <p className="mt-3 text-sm text-ink/50">Contact details open when a viewing is agreed.</p>
      )}
      <label className="mt-4 block text-sm">
        Note for the desk
        <textarea className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2" value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
      <Button className="mt-3" onClick={() => onNote(note)}>
        Send note
      </Button>
    </article>
  );
}
