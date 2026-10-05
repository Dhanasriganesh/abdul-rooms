import Workspace from "../../components/Workspace";

const links = [
  { to: "/portal", label: "Overview", end: true },
  { to: "/portal/listings", label: "Listings" },
  { to: "/portal/inquiries", label: "Inquiries" },
];

export default function PortalLayout() {
  return <Workspace links={links} />;
}
