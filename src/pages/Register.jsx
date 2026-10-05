import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Field, controlClass } from "../components/ui";
import { useApp } from "../context/AppState";
import { CITIES, homeFor } from "../lib/constants";
import { useTitle } from "../lib/useTitle";

export default function Register() {
  const { register, notify } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get("as") === "landlord" ? "landlord" : "seeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(params.get("email") || "");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Berlin");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState(params.get("ref") || "");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  useTitle("Create account");

  function onSubmit(event) {
    event.preventDefault();
    if (!consent) {
      setError(role === "landlord" ? "Confirm you can list these rooms." : "Confirm the desk may contact you about rooms.");
      return;
    }
    const result = register({ name, email, phone, city, password, role, referralCode });
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.user.referredBy) notify(`Referral ${result.user.referredBy} is attached to your account.`);
    navigate(homeFor(result.user.role));
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      <p className="text-xs uppercase tracking-[0.16em] text-brass">Account</p>
      <h1 className="mt-2 font-serif text-5xl">Create an account</h1>
      <div className="mt-6 grid grid-cols-2 rounded-full bg-white p-1 text-sm">
        {[
          ["seeker", "I need a room"],
          ["landlord", "I have rooms"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setRole(id)}
            className={`rounded-full px-3 py-2 ${role === id ? "bg-pine text-paper" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <Field label="Full name">
          <input className={controlClass} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
        </Field>
        <Field label="Email">
          <input className={controlClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
        </Field>
        <Field label="Phone">
          <input className={controlClass} value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" />
        </Field>
        <Field label="City">
          <select className={controlClass} value={city} onChange={(event) => setCity(event.target.value)}>
            {CITIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Password" hint="At least 6 characters. This demo keeps it in your browser only.">
          <input className={controlClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
        </Field>
        {role === "seeker" ? (
          <Field label="Referral code" hint="Optional.">
            <input className={controlClass} value={referralCode} onChange={(event) => setReferralCode(event.target.value.toUpperCase())} />
          </Field>
        ) : null}
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          <span>
            {role === "landlord"
              ? "I am the owner, or I have permission to list these rooms with Wohnbrücke."
              : "The desk may contact me about rooms that fit this account."}
          </span>
        </label>
        {error ? <p className="text-sm text-copper">{error}</p> : null}
        <Button type="submit">Create account</Button>
        <p className="text-sm text-ink/60">
          Already registered? <Link to="/login" className="underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
