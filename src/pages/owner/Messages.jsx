import { PageHeader, EmptyState } from "../../components/ui";
import { FiMessageSquare } from "react-icons/fi";

export default function OwnerMessages() {
  return (
    <div>
      <PageHeader title="Messages" subtitle="Communicate with applicants and tenants" />
      <EmptyState icon={FiMessageSquare} title="No messages yet" description="Your conversations with renters will appear here." />
    </div>
  );
}
