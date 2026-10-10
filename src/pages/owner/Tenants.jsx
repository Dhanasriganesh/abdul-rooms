import { PageHeader, Card, EmptyState } from "../../components/ui";
import { FiUsers } from "react-icons/fi";

export default function OwnerTenants() {
  return (
    <div>
      <PageHeader title="Tenants" subtitle="View and manage your tenants" />
      <EmptyState icon={FiUsers} title="No tenants yet" description="Your tenants will appear here once they move in." />
    </div>
  );
}
