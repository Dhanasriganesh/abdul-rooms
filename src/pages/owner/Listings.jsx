import { PageHeader, Card, EmptyState, ButtonLink } from "../../components/ui";
import { FiList, FiPlus } from "react-icons/fi";

export default function OwnerListings() {
  return (
    <div>
      <PageHeader
        title="Listings"
        subtitle="Manage your property listings"
        actions={<ButtonLink to="/dashboard/listings/new" className="gap-2"><FiPlus className="h-4 w-4" />Create Listing</ButtonLink>}
      />
      <EmptyState
        icon={FiList}
        title="No listings yet"
        description="Create your first listing to start receiving applications."
        action={<ButtonLink to="/dashboard/listings/new">Create Listing</ButtonLink>}
      />
    </div>
  );
}
