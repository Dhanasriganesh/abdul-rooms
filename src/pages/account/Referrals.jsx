import { useState } from "react";
import { Button, Panel } from "../../components/ui";
import { useApp } from "../../context/AppState";
import { REFERRAL_STATUSES, REWARD_EURO } from "../../lib/constants";
import { euro, shortDate } from "../../lib/format";
import { useTitle } from "../../lib/useTitle";

export default function Referrals() {
  const { state, user } = useApp();
  const [copied, setCopied] = useState(false);
  useTitle("Referrals");
  const link = `${window.location.origin}/register?ref=${user.referralCode}`;
  const mine = state.referrals.filter((item) => item.referrerId === user.id);
  const waiting = mine.filter((item) => item.status === "earned").reduce((sum, item) => sum + item.amount, 0);
  const paid = mine.filter((item) => item.status === "paid").reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <h1 className="font-serif text-4xl">Referrals</h1>
      <p className="mt-2 max-w-xl text-ink/70">
        Friends who register with your code start a file. When the desk confirms their move-in, €{REWARD_EURO} is recorded for you.
      </p>
      <Panel className="mt-6">
        <p className="text-xs uppercase tracking-[0.14em] text-brass">Your code</p>
        <p className="mt-1 font-serif text-4xl">{user.referralCode}</p>
        <p className="mt-2 break-all text-sm text-ink/55">{link}</p>
        <Button
          className="mt-4"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(link);
              setCopied(true);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? "Copied" : "Copy invite link"}
        </Button>
      </Panel>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-white p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-ink/45">Waiting for payout</p>
          <p className="mt-1 font-serif text-3xl">{euro(waiting)}</p>
        </div>
        <div className="rounded-3xl bg-white p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-ink/45">Recorded as paid</p>
          <p className="mt-1 font-serif text-3xl">{euro(paid)}</p>
        </div>
      </div>
      <ul className="mt-6 divide-y divide-ink/10 rounded-3xl bg-white px-4">
        {mine.length ? (
          mine.map((item) => {
            const person = state.users.find((entry) => entry.id === item.referredUserId);
            return (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span>
                  {person?.name || "Friend"}
                  <span className="block text-ink/50">{shortDate(item.createdAt)}</span>
                </span>
                <span>
                  {euro(item.amount)} · {REFERRAL_STATUSES[item.status]}
                </span>
              </li>
            );
          })
        ) : (
          <li className="py-4 text-sm text-ink/60">No referrals yet. Maya's sample code is MAYA-19 if you want to try the path on a new account.</li>
        )}
      </ul>
    </div>
  );
}
