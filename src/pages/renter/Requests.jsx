import { PageHeader, EmptyState, Button } from "../../components/ui";
import { FiTool, FiPlus } from "react-icons/fi";

export default function RenterRequests() {
  return (
    <div>
      <PageHeader 
        title="Maintenance Requests" 
        subtitle="Submit and track maintenance requests"
        actions={<Button className="gap-2"><FiPlus className="h-4 w-4" />New Request</Button>}
      />
      <EmptyState icon={FiTool} title="No requests yet" description="When you have maintenance issues, you can submit requests here." />
    </div>
  );
}
