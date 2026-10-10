import { PageHeader, Card, EmptyState, Button } from "../../components/ui";
import { FiHome, FiPlus } from "react-icons/fi";

export default function OwnerPropertyDetail() {
  return (
    <div>
      <PageHeader title="Property Details" subtitle="Manage units and view property information" />
      <Card>
        <EmptyState
          icon={FiHome}
          title="Property Details Coming Soon"
          description="This page will show property details and allow you to manage units."
        />
      </Card>
    </div>
  );
}
