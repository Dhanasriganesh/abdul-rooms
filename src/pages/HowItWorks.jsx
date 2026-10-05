import { Link } from "react-router-dom";
import { useTitle } from "../lib/useTitle";

const glossary = [
  ["Warmmiete", "The monthly amount people budget for. It includes basic rent plus the usual running costs, Nebenkosten."],
  ["Kaltmiete", "Basic rent before running costs. The legal deposit cap is three months of this amount."],
  ["Kaution", "The deposit, held against damage. It is separate from the first month of rent."],
  ["Anmeldung", "City registration at the address. Many students need a landlord confirmation, the Wohnungsgeberbestätigung."],
  ["WG", "A shared flat. Rooms are often offered to one person, with house rules about smoking and guests."],
  ["Bestellerprinzip", "The person who orders the broker pays. When the owner asks Wohnbrücke to fill the room, the seeker pays no broker fee."],
];

export default function HowItWorks() {
  useTitle("How it works");
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-xs uppercase tracking-[0.16em] text-brass">The file</p>
      <h1 className="mt-2 font-serif text-5xl">How a room gets introduced</h1>
      <div className="mt-8 space-y-8 text-ink/80">
        <p className="text-lg leading-relaxed">
          Wohnbrücke is the mediator. House owners keep the relationship with the desk. People looking for a room never have to chase a dozen listings or pay a commission to be introduced.
        </p>
        <ol className="space-y-5">
          {[
            ["The request", "Name, contact, cities, budget, move-in, and whether you need registration. A saved room can be attached."],
            ["The match", "The desk compares the request with rooms whose owners already asked Wohnbrücke to find someone."],
            ["The viewing", "Your phone and email stay off the public page. The owner sees them once a viewing is on the calendar."],
            ["The offer", "If both sides agree, the desk records the offer and the move-in. Your account shows the same status the coordinator sees."],
          ].map(([title, text], index) => (
            <li key={title} className="grid grid-cols-[auto_1fr] gap-4">
              <span className="font-serif text-2xl text-brass">0{index + 1}</span>
              <div>
                <h2 className="font-serif text-2xl text-ink">{title}</h2>
                <p className="mt-1 text-sm leading-relaxed">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <h2 className="mt-14 font-serif text-3xl">Words you will meet in Germany</h2>
      <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
        {glossary.map(([term, text]) => (
          <div key={term} className="grid gap-1 py-4 sm:grid-cols-[160px_1fr]">
            <dt className="font-medium">{term}</dt>
            <dd className="text-sm leading-relaxed text-ink/70">{text}</dd>
          </div>
        ))}
      </dl>
      <Link to="/request" className="mt-8 inline-flex rounded-full bg-pine px-4 py-2.5 text-sm font-medium text-paper">
        Start a request
      </Link>
    </div>
  );
}
