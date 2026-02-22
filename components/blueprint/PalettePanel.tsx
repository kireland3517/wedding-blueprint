import type { PaletteComponent } from "@/lib/types";

interface Props {
  palette: PaletteComponent;
}

export default function PalettePanel({ palette }: Props) {
  return (
    <section className="mb-12">
      <SectionLabel number="01" title="Palette" />
      <h3
        className="text-xl font-normal mb-6"
        style={{ fontFamily: "Georgia, serif", color: "var(--foreground)" }}
      >
        {palette.name}
      </h3>

      {/* Swatches */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {palette.swatches.map((hex, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div
              className="swatch"
              style={{ background: hex, width: "3rem", height: "3rem" }}
            />
            <span
              className="text-xs uppercase tracking-wide"
              style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
            >
              {hex}
            </span>
          </div>
        ))}
      </div>

      {/* Contrast note */}
      <p
        className="text-xs uppercase tracking-[0.15em] mb-4"
        style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
      >
        Contrast level: {palette.contrast_level}
      </p>

      {/* Usage rules */}
      <ul className="space-y-2">
        {palette.usage_rules.map((rule, i) => (
          <li
            key={i}
            className="text-sm leading-relaxed flex gap-3"
            style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
          >
            <span style={{ color: "var(--muted)" }}>—</span>
            {rule}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SectionLabel({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span
        className="text-xs tracking-[0.2em] uppercase"
        style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
      >
        {number}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      <span
        className="text-xs tracking-[0.2em] uppercase"
        style={{ color: "var(--foreground)", fontFamily: "Arial, sans-serif" }}
      >
        {title}
      </span>
    </div>
  );
}
