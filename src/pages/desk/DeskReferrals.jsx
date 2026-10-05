import { Button, DataTable, Pill } from "../../components/ui";
import { useApp } from "../../context/AppState";
import { REFERRAL_STATUSES } from "../../lib/constants";
import { euro, shortDate } from "../../lib/format";
import { useTitle } from "../../lib/useTitle";

export default function DeskReferrals() {
  const { state, payReferral, notify } = useApp();
  useTitle("Referrals");

  return (
    <div>
      <h1 className="font-serif text-4xl">Referrals</h1>
      <p className="mt-2 max-w-xl text-sm text-ink/65">
        A thank-you turns ready when the referred person is marked moved in. Recording a payout here is the desk's note. This demo does not send money.
      </p>
      <div className="mt-5">
        <DataTable
          rows={state.referrals}
          columns={[
            {
              key: "from",
              label: "From",
              render: (row) => state.users.find((user) => user.id === row.referrerId)?.name || "—",
            },
            {
              key: "to",
              label: "Friend",
              render: (row) => state.users.find((user) => user.id === row.referredUserId)?.name || "—",
            },
            { key: "code", label: "Code", render: (row) => row.code },
            { key: "amount", label: "Amount", render: (row) => euro(row.amount) },
            { key: "when", label: "Since", render: (row) => shortDate(row.createdAt) },
            {
              key: "status",
              label: "Status",
              render: (row) => <Pill status={row.status}>{REFERRAL_STATUSES[row.status]}</Pill>,
            },
            {
              key: "pay",
              label: "",
              render: (row) =>
                row.status === "earned" ? (
                  <Button
                    onClick={(event) => {
                      event.stopPropagation();
                      payReferral(row.id);
                      notify("Payout recorded.");
                    }}
                  >
                    Record payout
                  </Button>
                ) : (
                  "—"
                ),
            },
          ]}
        />
      </div>
    </div>
  );
}
