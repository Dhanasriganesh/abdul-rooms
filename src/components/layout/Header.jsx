import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppState";
import { homeFor } from "../../lib/constants";

const publicLinks = [
  ["Rooms", "/rooms"],
  ["How it works", "/how-it-works"],
  ["For owners", "/for-owners"],
  ["Referrals", "/refer"],
];

export default function Header() {
  const { user, logout } = useApp();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = user
    ? user.role === "mediator"
      ? [
          ["Desk", "/desk"],
          ["Requests", "/desk/requests"],
          ["Rooms", "/desk/rooms"],
          ["Owners", "/desk/owners"],
        ]
      : user.role === "landlord"
        ? [
            ["Portal", "/portal"],
            ["Listings", "/portal/listings"],
            ["Inquiries", "/portal/inquiries"],
          ]
        : [
            ["Rooms", "/rooms"],
            ["My requests", "/account/requests"],
            ["Referrals", "/account/referrals"],
          ]
    : publicLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="font-serif text-[1.7rem] leading-none tracking-tight">
          Wohnbrücke
        </Link>
        <nav className="hidden items-center gap-6 text-sm lg:flex">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "text-pine" : "text-ink/70 hover:text-ink")}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Link to={homeFor(user.role)} className="px-2 text-sm text-ink/70 hover:text-ink">
                {user.name.split(" ")[0]}
              </Link>
              <button type="button" onClick={logout} className="rounded-full px-3 py-2 text-sm text-ink/70 hover:bg-white">
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="rounded-full px-3 py-2 text-sm text-ink/70 hover:bg-white">
              Log in
            </Link>
          )}
          <Link to="/request" className="rounded-full bg-pine px-4 py-2 text-sm font-medium text-paper">
            Request a room
          </Link>
        </div>
        <button
          type="button"
          className="rounded-full border border-ink/15 px-3 py-2 text-sm lg:hidden"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <div className="border-t border-ink/10 bg-paper px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {links.map(([label, to]) => (
              <Link key={to} to={to} className="py-1">
                {label}
              </Link>
            ))}
            {user ? (
              <button type="button" onClick={logout} className="py-1 text-left">
                Log out
              </button>
            ) : (
              <Link to="/login">Log in</Link>
            )}
            <Link to="/request" className="mt-2 rounded-full bg-pine px-4 py-2 text-center text-paper">
              Request a room
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
