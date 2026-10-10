import { PageHeader, EmptyState } from "../../components/ui";
import { FiTool } from "react-icons/fi";

export default function OwnerRequests() {
  return (
    <div>
      <PageHeader title="Maintenance Requests" subtitle="Track and resolve tenant requests" />
      <EmptyState icon={FiTool} title="No requests yet" description="Maintenance requests from tenants will appear here." />
    </div>
  );
}
