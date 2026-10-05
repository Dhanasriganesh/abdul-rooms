import { useParams } from "react-router-dom";
import ListingEditor from "../../components/ListingEditor";
import { useTitle } from "../../lib/useTitle";

export default function PortalListingEdit() {
  const { id } = useParams();
  useTitle(id ? "Edit room" : "New room");
  return <ListingEditor key={id || "new"} listingId={id} />;
}
