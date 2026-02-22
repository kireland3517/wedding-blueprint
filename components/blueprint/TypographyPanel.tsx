import type { TypographyComponent } from "@/lib/types";
import { SectionLabel } from "./PalettePanel";

interface Props {
  typography: TypographyComponent;
}

export default function TypographyPanel({ typography }: Props) {
  return (
    <section className="mb-12">
      <SectionLabel number="02" title="Typography" />
      <h3
        className="text-xl font-normal mb-6"
        style={{ fontFamily: "Georgia, serif", color: "var(--foreground)" }}
      >
        {typography.name}
      </h3>

      {/* Font pairing display */}
      <div
        className="p-6 mb-6 space-y-4"
        style={{ border: "1px solid var(--border)", background: "#fefcfa" }}
      >
        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase mb-1"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            Heading
          </p>
          <p
            className="text-2xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {typography.heading_font}
          </p>
        </div>
        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase mb-1"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            Body
          </p>
          <p
            className="text-base"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            {typography.body_font}
          </p>
        </div>
        {typography.accent_font && (
          <div>
            <p
              className="text-xs tracking-[0.15em] uppercase mb-1"
              style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
            >
              Accent / Script
            </p>
            <p
              className="text-lg italic"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {typography.accent_font}
            </p>
          </div>
        )}
      </div>

      {/* Hierarchy notes */}
      <ul className="space-y-2">
        {typography.hierarchy_notes.map((note, i) => (
          <li
            key={i}
            className="text-sm leading-relaxed flex gap-3"
            style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
          >
            <span style={{ color: "var(--muted)" }}>—</span>
            {note}
          </li>
        ))}
      </ul>
    </section>
  );
}
