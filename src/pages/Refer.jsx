import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Panel } from "../components/ui";
import { useApp } from "../context/AppState";
import { REWARD_EURO, REFERRAL_STATUSES } from "../lib/constants";
import { euro } from "../lib/format";
import { useTitle } from "../lib/useTitle";

export default function Refer() {
  const { user, state } = useApp();
  const [copied, setCopied] = useState(false);
  useTitle("Referrals");
  const code = user?.role === "seeker" ? user.referralCode : "";
  const link = code ? `${window.location.origin}/register?ref=${code}` : "";
  const mine = user ? state.referrals.filter((item) => item.referrerId === user.id) : [];

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-xs uppercase tracking-[0.16em] text-brass">Thank-you</p>
      <h1 className="mt-2 font-serif text-5xl">€{REWARD_EURO} when a friend moves in</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        Share your code. When that person creates an account and later moves into a room from the Wohnbrücke network, the desk records a €{REWARD_EURO} thank-you for you.
      </p>
      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Share the code", "It travels with the registration link."],
          ["They request a room", "The file is theirs. Your name stays on the referral."],
          ["They move in", "The desk marks the thank-you, then records the payout."],
        ].map(([title, text], index) => (
          <li key={title} className="rounded-3xl bg-white p-4">
            <p className="font-serif text-2xl text-brass">0{index + 1}</p>
            <h2 className="mt-2 font-medium">{title}</h2>
            <p className="mt-1 text-sm text-ink/65">{text}</p>
          </li>
        ))}
      </ol>

      {code ? (
        <Panel className="mt-8">
          <p className="text-xs uppercase tracking-[0.16em] text-brass">Your code</p>
          <p className="mt-2 font-serif text-4xl">{code}</p>
          <p className="mt-2 break-all text-sm text-ink/60">{link}</p>
          <Button className="mt-4" onClick={copy}>
            {copied ? "Copied" : "Copy invite link"}
          </Button>
          <ul className="mt-6 divide-y divide-ink/10">
            {mine.length ? (
              mine.map((item) => {
                const person = state.users.find((entry) => entry.id === item.referredUserId);
                return (
                  <li key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <span>{person?.name || "Friend"}</span>
                    <span>
                      {euro(item.amount)} · {REFERRAL_STATUSES[item.status]}
                    </span>
                  </li>
                );
              })
            ) : (
              <li className="py-3 text-sm text-ink/60">No one has used your code yet.</li>
            )}
          </ul>
        </Panel>
      ) : (
        <div className="mt-8">
          <Link to="/register" className="rounded-full bg-pine px-4 py-2.5 text-sm font-medium text-paper">
            Create an account to get a code
          </Link>
        </div>
      )}
    </div>
  );
}
