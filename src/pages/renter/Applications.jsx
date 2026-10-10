import { PageHeader, EmptyState, Card, Badge, ButtonLink } from "../../components/ui";
import { FiFileText, FiSearch } from "react-icons/fi";

export default function RenterApplications() {
  const applications = [];
  
  return (
    <div>
      <PageHeader title="My Applications" subtitle="Track your rental applications" />
      {applications.length === 0 ? (
        <EmptyState 
          icon={FiFileText} 
          title="No applications yet" 
          description="When you apply for listings, you can track them here."
          action={<ButtonLink to="/my-home/discover"><FiSearch className="h-4 w-4 mr-2" />Find Homes</ButtonLink>}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{app.listing}</p>
                  <p className="text-sm text-gray-500">Applied {app.date}</p>
                </div>
                <Badge>{app.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
