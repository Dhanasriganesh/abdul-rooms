import Workspace from "../../components/Workspace";

const links = [
  { to: "/account", label: "Overview", end: true },
  { to: "/account/requests", label: "Requests" },
  { to: "/account/saved", label: "Saved rooms" },
  { to: "/account/referrals", label: "Referrals" },
  { to: "/account/profile", label: "Profile" },
];

export default function AccountLayout() {
  return <Workspace links={links} />;
}
