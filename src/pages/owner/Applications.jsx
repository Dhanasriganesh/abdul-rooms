import { PageHeader, Card, EmptyState, Badge, Table } from "../../components/ui";
import { FiInbox, FiUser, FiHome, FiCalendar } from "react-icons/fi";

export default function OwnerApplications() {
  const applications = [];
  
  return (
    <div>
      <PageHeader title="Applications" subtitle="Review and manage rental applications" />
      {applications.length === 0 ? (
        <EmptyState
          icon={FiInbox}
          title="No applications yet"
          description="When renters apply for your listings, they'll appear here."
        />
      ) : (
        <Card padding={false}>
          <Table
            columns={[
              { key: "applicant", label: "Applicant", render: (row) => row.name },
              { key: "listing", label: "Listing", render: (row) => row.listing },
              { key: "date", label: "Applied", render: (row) => row.date },
              { key: "status", label: "Status", render: (row) => <Badge>{row.status}</Badge> },
            ]}
            data={applications}
          />
        </Card>
      )}
    </div>
  );
}
