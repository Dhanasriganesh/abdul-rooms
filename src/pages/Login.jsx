import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Field, Panel, controlClass } from "../components/ui";
import { useApp } from "../context/AppState";
import { homeFor } from "../lib/constants";
import { useTitle } from "../lib/useTitle";

const demos = [
  ["Seeker", "maya@wohnbruecke.de", "Requests, saved rooms, referrals"],
  ["Owner", "amira@wohnbruecke.de", "Berlin rooms and inquiries"],
  ["Mediator", "mediator@wohnbruecke.de", "The full desk"],
];

export default function Login() {
  const { login, user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  useTitle("Log in");

  function finish(result) {
    if (result.error) {
      setError(result.error);
      return;
    }
    const from = location.state?.from;
    navigate(typeof from === "string" && from.startsWith("/") ? from : homeFor(result.user.role));
  }

  function onSubmit(event) {
    event.preventDefault();
    finish(login(email, password));
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 lg:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-brass">Account</p>
        <h1 className="mt-2 font-serif text-5xl">Log in</h1>
        <p className="mt-3 text-ink/70">
          Seekers follow their requests. Owners see inquiries. The mediator runs the desk. Every sample password is{" "}
          <span className="font-medium text-ink">bruecke</span>.
        </p>
        {user ? (
          <p className="mt-4 text-sm">
            Signed in as {user.name}.{" "}
            <button type="button" className="underline" onClick={logout}>
              Log out
            </button>
          </p>
        ) : null}
        <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-4" noValidate>
          <Field label="Email">
            <input className={controlClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" />
          </Field>
          <Field label="Password">
            <input className={controlClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
          </Field>
          {error ? <p className="text-sm text-copper">{error}</p> : null}
          <Button type="submit">Log in</Button>
          <p className="text-sm text-ink/60">
            New here? <Link to="/register" className="underline">Create an account</Link>
          </p>
        </form>
      </div>
      <div className="space-y-3">
        {demos.map(([role, address, text]) => (
          <Panel key={address} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-brass">{role}</p>
              <p className="mt-1 font-medium">{address}</p>
              <p className="text-sm text-ink/60">{text}</p>
            </div>
            <Button
              variant="line"
              onClick={() => {
                setEmail(address);
                setPassword("bruecke");
                finish(login(address, "bruecke"));
              }}
            >
              Enter
            </Button>
          </Panel>
        ))}
      </div>
    </div>
  );
}
