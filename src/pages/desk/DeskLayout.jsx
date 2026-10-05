import Workspace from "../../components/Workspace";

const links = [
  { to: "/desk", label: "Overview", end: true },
  { to: "/desk/requests", label: "Requests" },
  { to: "/desk/rooms", label: "Rooms" },
  { to: "/desk/owners", label: "Owners" },
  { to: "/desk/people", label: "People" },
  { to: "/desk/referrals", label: "Referrals" },
];

export default function DeskLayout() {
  return <Workspace links={links} />;
}
