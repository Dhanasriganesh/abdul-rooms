import { PageHeader, Card, EmptyState, StatsCard } from "../../components/ui";
import { FiDollarSign, FiTrendingUp, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default function OwnerRent() {
  return (
    <div>
      <PageHeader title="Rent & Payments" subtitle="Track rent collection and payment status" />
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <StatsCard label="Expected This Month" value="€8,500" icon={FiDollarSign} />
        <StatsCard label="Collected" value="€6,800" icon={FiCheckCircle} trend="up" />
        <StatsCard label="Pending" value="€1,200" icon={FiTrendingUp} trend="neutral" />
        <StatsCard label="Overdue" value="€500" icon={FiAlertCircle} trend="down" />
      </div>
      <EmptyState icon={FiDollarSign} title="No rent charges yet" description="Rent charges will appear here when you have active tenancies." />
    </div>
  );
}
