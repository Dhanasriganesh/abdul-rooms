import { useNavigate } from "react-router-dom";
import { DataTable } from "../../components/ui";
import { useApp } from "../../context/AppState";
import { labelOf, OCCUPATIONS } from "../../lib/constants";
import { shortDate } from "../../lib/format";
import { requestsForUser } from "../../lib/store";
import { useTitle } from "../../lib/useTitle";

export default function DeskPeople() {
  const { state } = useApp();
  const navigate = useNavigate();
  const people = state.users.filter((user) => user.role === "seeker");
  useTitle("People");

  return (
    <div>
      <h1 className="font-serif text-4xl">People looking</h1>
      <p className="mt-2 text-sm text-ink/65">Open a row to see that person's requests.</p>
      <div className="mt-5">
        <DataTable
          rows={people}
          onRow={(row) => navigate(`/desk/requests?seeker=${row.id}`)}
          columns={[
            { key: "name", label: "Name", render: (row) => row.name },
            { key: "email", label: "Email", render: (row) => row.email },
            { key: "city", label: "City", render: (row) => row.city || "—" },
            { key: "role", label: "Situation", render: (row) => labelOf(OCCUPATIONS, row.occupation) },
            { key: "code", label: "Code", render: (row) => row.referralCode },
            { key: "files", label: "Requests", render: (row) => requestsForUser(state, row).length },
            { key: "joined", label: "Joined", render: (row) => shortDate(row.createdAt) },
          ]}
        />
      </div>
    </div>
  );
}
