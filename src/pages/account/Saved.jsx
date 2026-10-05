import { Empty } from "../../components/ui";
import RoomCard from "../../components/RoomCard";
import { useApp } from "../../context/AppState";
import { useTitle } from "../../lib/useTitle";

export default function Saved() {
  const { state, user } = useApp();
  const rooms = user.saved.map((id) => state.listings.find((listing) => listing.id === id)).filter(Boolean);
  useTitle("Saved rooms");

  return (
    <div>
      <h1 className="font-serif text-4xl">Saved rooms</h1>
      {rooms.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {rooms.map((listing) => (
            <RoomCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <Empty title="Nothing saved" text="Open a room and save it. The list stays on this account." />
        </div>
      )}
    </div>
  );
}
