import { Link } from "react-router-dom";
import { useApp } from "../../context/AppState";

export default function Footer() {
  const { resetDemo } = useApp();
  return (
    <footer className="mt-16 border-t border-ink/10 bg-[#ebe4d6]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl">Wohnbrücke</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            A mediation desk for rooms in Germany. Owners commission the search. Residents send one request.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink/45">Residents</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/rooms">Open rooms</Link>
            <Link to="/request">Send a request</Link>
            <Link to="/refer">Refer a friend</Link>
            <Link to="/how-it-works">Warm rent, deposit, Anmeldung</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink/45">Owners</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/for-owners">List a room</Link>
            <Link to="/register?as=landlord">Owner login</Link>
            <Link to="/login">Desk login</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink/45">This demo</p>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            Sample rooms and accounts stay in this browser. Password for every sample login is bruecke.
          </p>
          <button type="button" onClick={resetDemo} className="mt-3 text-sm underline">
            Restore sample data
          </button>
        </div>
      </div>
      <div className="border-t border-ink/10">
        <p className="mx-auto max-w-6xl px-5 py-4 text-xs leading-relaxed text-ink/55">
          For residential rentals in Germany, the person who commissions the broker pays. When a landlord asks Wohnbrücke to
          fill a room, the seeker does not pay a brokerage fee. Deposit on a German tenancy is capped at three months of basic
          rent, paid separately from the first warm rent.
        </p>
      </div>
    </footer>
  );
}
