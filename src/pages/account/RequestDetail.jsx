import { Link, useParams } from "react-router-dom";
import { ListingLink, RequestFacts, Timeline } from "../../components/RequestView";
import { Pill } from "../../components/ui";
import { useApp } from "../../context/AppState";
import { STATUS_HELP, statusLabel } from "../../lib/constants";
import { requestsForUser } from "../../lib/store";
import { useTitle } from "../../lib/useTitle";

export default function RequestDetail() {
  const { id } = useParams();
  const { state, user } = useApp();
  const request = requestsForUser(state, user).find((item) => item.id === id);
  useTitle("Request");

  if (!request) {
    return <p>That request is not on your account.</p>;
  }

  const listing = state.listings.find((item) => item.id === (request.assignedListingId || request.listingId));

  return (
    <div>
      <Link to="/account/requests" className="text-sm text-ink/55">
        All requests
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-4xl">{request.cities.join(", ")}</h1>
        <Pill status={request.status}>{statusLabel(request.status)}</Pill>
      </div>
      <p className="mt-3 max-w-xl text-ink/70">{STATUS_HELP[request.status]}</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-white p-5">
          <RequestFacts request={request} />
          {request.notes ? <p className="mt-4 text-sm leading-relaxed text-ink/75">{request.notes}</p> : null}
        </div>
        <div className="space-y-4">
          <ListingLink listing={listing} />
          <div className="rounded-3xl bg-white p-5">
            <h2 className="font-serif text-2xl">Updates</h2>
            <div className="mt-4">
              <Timeline history={request.history} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
