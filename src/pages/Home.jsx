import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoomCard from "../components/RoomCard";
import { useApp } from "../context/AppState";
import { CITIES, statusLabel } from "../lib/constants";
import { euro } from "../lib/format";
import { liveListings } from "../lib/store";
import { useTitle } from "../lib/useTitle";
import { Button, controlClass } from "../components/ui";

export default function Home() {
  const { state } = useApp();
  const navigate = useNavigate();
  const live = liveListings(state);
  const [city, setCity] = useState("");
  const [max, setMax] = useState("");
  useTitle("");

  const cityCounts = CITIES.map((name) => ({
    name,
    count: live.filter((listing) => listing.city === name).length,
  })).filter((item) => item.count > 0);

  const recent = [...state.requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);

  function search(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (max) params.set("max", max);
    navigate(`/rooms?${params.toString()}`);
  }

  return (
    <div>
      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brass">Room mediation · Germany</p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.02] sm:text-6xl">
              A room, introduced by the person the landlord already trusts.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/75">
              Wohnbrücke keeps a private network of house owners. Students and other residents send one request. The desk
              matches a room, arranges the viewing, and stays on the file until move-in.
            </p>
            <form onSubmit={search} className="mt-8 grid gap-3 rounded-3xl border border-ink/10 bg-white p-3 sm:grid-cols-[1fr_140px_auto]">
              <select className={controlClass} value={city} onChange={(event) => setCity(event.target.value)} aria-label="City">
                <option value="">All cities</option>
                {CITIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <input
                className={controlClass}
                type="number"
                min="150"
                placeholder="Max € warm"
                aria-label="Maximum warm rent"
                value={max}
                onChange={(event) => setMax(event.target.value)}
              />
              <Button type="submit">Search rooms</Button>
            </form>
            <p className="mt-3 text-sm text-ink/55">
              Or <Link to="/request" className="underline">send a request</Link> and let the desk search the network.
            </p>
            <dl className="mt-8 grid max-w-lg grid-cols-3 gap-4">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-ink/45">Open rooms</dt>
                <dd className="mt-1 font-serif text-3xl">{live.length}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-ink/45">Owners</dt>
                <dd className="mt-1 font-serif text-3xl">{state.owners.length}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-ink/45">Seeker fee</dt>
                <dd className="mt-1 font-serif text-3xl">€0</dd>
              </div>
            </dl>
          </div>
          <aside className="rounded-[2rem] bg-pine p-6 text-paper sm:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-paper/60">On the desk</p>
            <h2 className="mt-2 font-serif text-3xl">Files moving this month</h2>
            <ul className="mt-6 space-y-3">
              {recent.map((request) => (
                <li key={request.id} className="rounded-2xl bg-white/10 px-4 py-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">{request.name}</span>
                    <span className="text-paper/70">{statusLabel(request.status)}</span>
                  </div>
                  <p className="mt-1 text-sm text-paper/75">
                    {request.cities.join(", ")} · up to {euro(request.budget)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-paper/75">
              Landlords commission Wohnbrücke, so people looking for a room do not pay a broker fee.
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-wrap gap-2">
          {cityCounts.map((item) => (
            <Link
              key={item.name}
              to={`/rooms?city=${encodeURIComponent(item.name)}`}
              className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm"
            >
              {item.name}
              <span className="ml-2 text-ink/45">{item.count}</span>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex items-end justify-between gap-4">
          <h2 className="font-serif text-4xl">Open rooms</h2>
          <Link to="/rooms" className="text-sm text-pine underline">
            All rooms
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {live.slice(0, 3).map((listing) => (
            <RoomCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-3">
          {[
            ["01", "You send one request", "City, budget, move-in date, and whether you need Anmeldung. A preferred room is optional."],
            ["02", "The desk matches an owner", "Coordinators work from landlords who already list with Wohnbrücke. Your number is not posted on a board."],
            ["03", "Viewing, then the contract", "Follow the file from your account. A €75 thank-you is recorded when a friend you referred moves in."],
          ].map(([step, title, text]) => (
            <article key={step}>
              <p className="font-serif text-3xl text-brass">{step}</p>
              <h3 className="mt-3 font-serif text-2xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-14 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-ink/10 bg-white p-8">
          <p className="text-xs uppercase tracking-[0.16em] text-brass">Residents</p>
          <h2 className="mt-2 font-serif text-4xl">Students, workers, anyone who needs a room.</h2>
          <p className="mt-3 text-ink/70">
            Create an account to watch the request, save rooms, and share a referral code. Sample seeker login: maya@wohnbruecke.de
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/request" className="rounded-full bg-copper px-4 py-2.5 text-sm font-medium text-white">
              Fill in the form
            </Link>
            <Link to="/register" className="rounded-full border border-ink/15 px-4 py-2.5 text-sm">
              Create an account
            </Link>
          </div>
        </article>
        <article className="rounded-[2rem] bg-[#243044] p-8 text-paper">
          <p className="text-xs uppercase tracking-[0.16em] text-paper/55">House owners</p>
          <h2 className="mt-2 font-serif text-4xl">You already know the desk. Send the next room.</h2>
          <p className="mt-3 text-paper/75">
            Listings stay off public boards until the desk checks them. Inquiries come back through the portal, with contact details opening once a viewing is agreed.
          </p>
          <Link to="/for-owners" className="mt-6 inline-flex rounded-full bg-paper px-4 py-2.5 text-sm font-medium text-ink">
            Talk to the desk
          </Link>
        </article>
      </section>
    </div>
  );
}
