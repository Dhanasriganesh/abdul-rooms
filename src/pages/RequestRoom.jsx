import { useSearchParams } from "react-router-dom";
import RequestForm from "../components/RequestForm";
import { useApp } from "../context/AppState";
import { useTitle } from "../lib/useTitle";

export default function RequestRoom() {
  const { state } = useApp();
  const [params] = useSearchParams();
  const listing = state.listings.find((item) => item.id === params.get("room") && item.status === "live");
  useTitle("Request a room");

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <p className="text-xs uppercase tracking-[0.16em] text-brass">For residents</p>
      <h1 className="mt-2 font-serif text-5xl">Tell the desk what you need</h1>
      <p className="mt-3 text-ink/70">
        One form is enough. If you already have an account, the request is filed under your name and you can follow every step.
      </p>
      <div className="mt-8">
        <RequestForm listing={listing} presetCity={params.get("city") || ""} presetCode={params.get("ref") || ""} />
      </div>
    </div>
  );
}
