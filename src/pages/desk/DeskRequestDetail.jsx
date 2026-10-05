import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ListingLink, RequestFacts, Timeline } from "../../components/RequestView";
import { Button, Field, Panel, Pill, controlClass } from "../../components/ui";
import { useApp } from "../../context/AppState";
import { REQUEST_STATUSES, statusLabel } from "../../lib/constants";
import { euro } from "../../lib/format";
import { useTitle } from "../../lib/useTitle";

export default function DeskRequestDetail() {
  const { id } = useParams();
  const { state, review, notify } = useApp();
  const request = state.requests.find((item) => item.id === id);
  useTitle(request ? request.name : "Request");
  const [status, setStatus] = useState(request?.status || "new");
  const [assignedListingId, setAssignedListingId] = useState(request?.assignedListingId || "");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!request) return;
    setStatus(request.status);
    setAssignedListingId(request.assignedListingId || "");
  }, [request]);

  if (!request) return <p>That request is not on file.</p>;

  const preferred = state.listings.find((item) => item.id === request.listingId);
  const assigned = state.listings.find((item) => item.id === assignedListingId);

  function onSave(event) {
    event.preventDefault();
    review({ id: request.id, status, note, assignedListingId });
    setNote("");
    notify("Request updated.");
  }

  return (
    <div>
      <Link to="/desk/requests" className="text-sm text-ink/55">
        All requests
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-4xl">{request.name}</h1>
        <Pill status={request.status}>{statusLabel(request.status)}</Pill>
      </div>
      <p className="mt-2 text-sm text-ink/70">
        {request.email} · {request.phone}
        {request.userId ? "" : " · no account yet"}
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <Panel>
            <RequestFacts request={request} />
            {request.notes ? <p className="mt-4 text-sm leading-relaxed">{request.notes}</p> : null}
          </Panel>
          <Panel>
            <h2 className="font-serif text-2xl">Preferred room</h2>
            <div className="mt-3">
              <ListingLink listing={preferred} />
            </div>
          </Panel>
          <Panel>
            <h2 className="font-serif text-2xl">File</h2>
            <div className="mt-4">
              <Timeline history={request.history} />
            </div>
          </Panel>
        </div>
        <form onSubmit={onSave} className="h-fit space-y-4 rounded-3xl bg-white p-5 lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl">Update the file</h2>
          <Field label="Status">
            <select className={controlClass} value={status} onChange={(event) => setStatus(event.target.value)}>
              {REQUEST_STATUSES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Assign a room">
            <select className={controlClass} value={assignedListingId} onChange={(event) => setAssignedListingId(event.target.value)}>
              <option value="">None yet</option>
              {state.listings.map((listing) => (
                <option key={listing.id} value={listing.id}>
                  {listing.city} · {listing.area} · {euro(listing.warmRent)} · {listing.status}
                </option>
              ))}
            </select>
          </Field>
          {assigned ? <ListingLink listing={assigned} /> : null}
          <Field label="Note on the file">
            <textarea className={`${controlClass} min-h-24`} value={note} onChange={(event) => setNote(event.target.value)} />
          </Field>
          <Button type="submit">Save update</Button>
          {status === "placed" ? (
            <p className="text-xs text-ink/55">Marking moved-in records a referral thank-you when this person joined with a code.</p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
