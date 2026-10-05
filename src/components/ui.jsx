import { Link } from "react-router-dom";

export const controlClass =
  "w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-pine focus:ring-2 focus:ring-pine/20";

const buttonStyles = {
  primary: "bg-pine text-paper hover:bg-[#143128]",
  copper: "bg-copper text-white hover:bg-[#9a3e26]",
  line: "border border-ink/15 bg-white text-ink hover:border-ink/40",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
  paper: "bg-paper text-ink hover:bg-white",
};

export function Button({ variant = "primary", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${buttonStyles[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({ to, variant = "primary", className = "", children, ...props }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${buttonStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

export function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-copper">{error}</span> : null}
      {hint && !error ? <span className="mt-1 block text-xs text-ink/55">{hint}</span> : null}
    </label>
  );
}

export function Panel({ children, className = "" }) {
  return <section className={`rounded-3xl border border-ink/10 bg-white p-5 sm:p-6 ${className}`}>{children}</section>;
}

export function Empty({ title, text, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-ink/20 bg-white px-6 py-12 text-center">
      <h3 className="font-serif text-2xl">{title}</h3>
      {text ? <p className="mx-auto mt-2 max-w-md text-sm text-ink/65">{text}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

const pillTone = {
  new: "bg-[#efe4cc] text-[#6d5420]",
  in_review: "bg-[#ead9c4] text-[#6a4524]",
  viewing: "bg-[#d7ebe2] text-[#1a3c32]",
  offered: "bg-[#f3d7cc] text-[#8a3824]",
  placed: "bg-pine text-paper",
  closed: "bg-ink/10 text-ink/70",
  pending: "bg-[#efe4cc] text-[#6d5420]",
  live: "bg-[#d7ebe2] text-[#1a3c32]",
  reserved: "bg-[#f3d7cc] text-[#8a3824]",
  let: "bg-ink/10 text-ink/70",
  hidden: "bg-ink/10 text-ink/50",
  registered: "bg-[#ead9c4] text-[#6a4524]",
  earned: "bg-[#d7ebe2] text-[#1a3c32]",
  paid: "bg-pine text-paper",
  contacted: "bg-[#d7ebe2] text-[#1a3c32]",
  declined: "bg-ink/10 text-ink/60",
};

export function Pill({ status, children }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${pillTone[status] || "bg-sand text-ink"}`}>
      {children}
    </span>
  );
}

export function DataTable({ columns, rows, onRow }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-ink/10 bg-white">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="border-b border-ink/10 text-[11px] uppercase tracking-[0.14em] text-ink/45">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={onRow ? () => onRow(row) : undefined}
              className={`border-t border-ink/5 ${onRow ? "cursor-pointer hover:bg-paper" : ""}`}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 align-middle">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
