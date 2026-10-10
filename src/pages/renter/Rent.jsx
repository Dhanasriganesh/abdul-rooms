import { PageHeader, Card, EmptyState, Badge, Button } from "../../components/ui";
import { FiDollarSign, FiCalendar, FiCheckCircle } from "react-icons/fi";

export default function RenterRent() {
  const rentCharges = [];
  
  return (
    <div>
      <PageHeader title="Rent & Payments" subtitle="View and pay your rent" />
      {rentCharges.length === 0 ? (
        <EmptyState icon={FiDollarSign} title="No rent charges yet" description="Your rent charges will appear here." />
      ) : (
        <div className="space-y-4">
          {rentCharges.map((charge) => (
            <Card key={charge.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{charge.period}</p>
                  <p className="text-sm text-gray-500">Due {charge.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">€{charge.amount}</p>
                  <Badge variant={charge.status === "paid" ? "success" : "warning"}>{charge.status}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
