import { Link } from "react-router-dom";
import { labelOf, OCCUPATIONS, ROOM_TYPES, SMOKING, statusLabel } from "../lib/constants";
import { euro, referenceFor, shortDate } from "../lib/format";

export function RequestFacts({ request }) {
  const rows = [
    ["Reference", referenceFor(request.id)],
    ["Occupation", labelOf(OCCUPATIONS, request.occupation)],
    ["Place", request.institution || "—"],
    ["Cities", request.cities.join(", ")],
    ["Budget", `${euro(request.budget)} warm`],
    ["Move-in", shortDate(request.moveIn)],
    ["Stay", request.stay],
    ["Room", request.roomType === "any" ? "Open to any" : labelOf(ROOM_TYPES, request.roomType)],
    ["German", request.germanLevel || "Not specified"],
    ["Smoking", labelOf(SMOKING, request.smoking)],
    ["Anmeldung", request.anmeldung ? "Needed" : "Not required"],
    ["Proof of income or enrolment", request.proof ? "Can share" : "Not confirmed"],
    ["Pet", request.pets ? "Yes" : "No"],
  ];
  return (
    <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs uppercase tracking-[0.12em] text-ink/45">{label}</dt>
          <dd className="mt-1">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Timeline({ history }) {
  return (
    <ol className="space-y-4 border-l border-ink/10 pl-4">
      {[...history].reverse().map((item, index) => (
        <li key={`${item.at}-${index}`}>
          <p className="text-xs text-ink/45">{shortDate(item.at)} · {statusLabel(item.status)}</p>
          <p className="text-sm">{item.note}</p>
        </li>
      ))}
    </ol>
  );
}

export function ListingLink({ listing }) {
  if (!listing) return <p className="text-sm text-ink/55">No room attached yet.</p>;
  return (
    <Link to={`/rooms/${listing.id}`} className="block rounded-2xl border border-ink/10 bg-paper px-4 py-3">
      <p className="font-medium">{listing.title}</p>
      <p className="text-sm text-ink/60">
        {listing.city} · {listing.area} · {euro(listing.warmRent)} warm
      </p>
    </Link>
  );
}
