import { PageHeader, Card, EmptyState, Badge } from "../../components/ui";
import { FiHome, FiCalendar, FiUser, FiMapPin } from "react-icons/fi";

export default function RenterTenancy() {
  const hasTenancy = false;
  
  return (
    <div>
      <PageHeader title="My Tenancy" subtitle="Your current rental agreement details" />
      {!hasTenancy ? (
        <EmptyState icon={FiHome} title="No active tenancy" description="Once you move into a property, your tenancy details will appear here." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FiMapPin className="h-5 w-5 text-gray-400" />
                <span>Mitte, Berlin</span>
              </div>
              <div className="flex items-center gap-3">
                <FiCalendar className="h-5 w-5 text-gray-400" />
                <span>Since January 1, 2024</span>
              </div>
              <div className="flex items-center gap-3">
                <FiUser className="h-5 w-5 text-gray-400" />
                <span>Property Owner: Max Mustermann</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
