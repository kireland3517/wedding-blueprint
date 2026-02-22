import Link from "next/link";

const LANES = [
  { name: "Architectural Minimal", color: "#8A9BA8" },
  { name: "Refined Black Tie", color: "#2C2C2E" },
  { name: "Soft Romantic Garden", color: "#E8C4B8" },
  { name: "Earthy Textural Warmth", color: "#C4714A" },
  { name: "Bold Graphic Editorial", color: "#1A1A1A" },
];

export default function HomePage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ background: "var(--background)" }}
    >
      {/* Eyebrow */}
      <p
        className="text-xs tracking-[0.25em] uppercase mb-6"
        style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
      >
        A design tool for the DIY bride
      </p>

      {/* Title */}
      <h1
        className="text-5xl md:text-6xl font-normal leading-tight text-center mb-12"
        style={{ fontFamily: "Georgia, serif", color: "var(--foreground)" }}
      >
        Wedding Blueprint
        <br />
        <em>Generator</em>
      </h1>

      {/* Rule */}
      <div className="w-16 mb-10" style={{ borderTop: "1px solid var(--border)" }} />

      {/* Description */}
      <p
        className="text-center max-w-md text-lg leading-relaxed mb-12"
        style={{ color: "var(--muted)", fontFamily: "Georgia, serif" }}
      >
        Answer eight questions. Receive a complete, cohesive design direction —
        palette, typography, paper, florals, and signage — built for your day.
      </p>

      {/* Lane dots */}
      <div className="flex gap-3 mb-14">
        {LANES.map((lane) => (
          <div
            key={lane.name}
            className="swatch"
            style={{ background: lane.color }}
            title={lane.name}
          />
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/quiz"
        className="px-10 py-4 text-sm transition-opacity hover:opacity-80"
        style={{
          background: "var(--foreground)",
          color: "var(--background)",
          fontFamily: "Arial, sans-serif",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        Build My Blueprint
      </Link>

      <p
        className="mt-8 text-xs"
        style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
      >
        8 questions · 2 minutes · no account required
      </p>
    </main>
  );
}
