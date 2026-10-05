import { NavLink, Outlet } from "react-router-dom";

export default function Workspace({ links, children }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 md:grid-cols-[210px_minmax(0,1fr)] md:py-12">
      <aside>
        <nav className="flex gap-2 overflow-x-auto pb-1 md:sticky md:top-24 md:flex-col md:overflow-visible">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-2 text-sm ${isActive ? "bg-pine text-paper" : "text-ink/70 hover:bg-white"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">{children || <Outlet />}</div>
    </div>
  );
}
