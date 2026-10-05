const palettes = {
  pine: ["#1a3c32", "#c46a45", "#e7d7b8"],
  night: ["#243044", "#c4a574", "#efe6d6"],
  clay: ["#6e3b2e", "#e6d3b3", "#1a3c32"],
  moss: ["#2f4a3c", "#d7c4a3", "#b24a2e"],
  ink: ["#2a2622", "#8c6a3d", "#f3efe6"],
  lake: ["#1d3e4a", "#d08a62", "#efe4d2"],
};

export default function RoomPortrait({ tone = "pine", className = "" }) {
  const [base, accent, paper] = palettes[tone] || palettes.pine;
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: base }} aria-hidden="true">
      <div className="absolute -right-4 top-5 h-24 w-16 rounded-sm" style={{ background: paper, opacity: 0.92 }} />
      <div className="absolute right-6 top-8 grid grid-cols-2 gap-1">
        <span className="h-5 w-4" style={{ background: accent }} />
        <span className="h-5 w-4 bg-white/80" />
        <span className="h-5 w-4 bg-white/45" />
        <span className="h-5 w-4" style={{ background: accent }} />
      </div>
      <div className="absolute bottom-5 left-4 h-8 w-14 rounded-sm" style={{ background: paper }} />
      <div className="absolute bottom-5 left-20 h-12 w-3 rounded-sm bg-black/20" />
      <div
        className="absolute inset-x-0 bottom-0 h-16"
        style={{ background: `linear-gradient(to top, ${base}, transparent)` }}
      />
    </div>
  );
}
