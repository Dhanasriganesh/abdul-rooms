import { Link } from "react-router-dom";
import { useTitle } from "../lib/useTitle";

export default function NotFound() {
  useTitle("Page missing");
  return (
    <div className="mx-auto max-w-xl px-5 py-20">
      <h1 className="font-serif text-5xl">That page is not on the desk.</h1>
      <Link to="/" className="mt-6 inline-flex text-sm text-pine underline">
        Back to the start
      </Link>
    </div>
  );
}
