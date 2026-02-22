import type { FloralsComponent } from "@/lib/types";
import { SectionLabel } from "./PalettePanel";

interface Props {
  florals: FloralsComponent;
}

export default function FloralsPanel({ florals }: Props) {
  return (
    <section className="mb-12">
      <SectionLabel number="04" title="Florals Direction" />
      <h3
        className="text-xl font-normal mb-2"
        style={{ fontFamily: "Georgia, serif", color: "var(--foreground)" }}
      >
        {florals.name}
      </h3>
      <p
        className="text-sm mb-6 leading-relaxed"
        style={{ fontFamily: "Arial, sans-serif", color: "var(--muted)" }}
      >
        {florals.arrangement_style}
      </p>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase mb-3"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            Key Flowers
          </p>
          <ul className="space-y-1">
            {florals.key_flowers.map((f, i) => (
              <li
                key={i}
                className="text-sm"
                style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase mb-3"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            Foliage
          </p>
          <ul className="space-y-1">
            {florals.foliage.map((f, i) => (
              <li
                key={i}
                className="text-sm"
                style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-6">
        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase mb-1"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            Density
          </p>
          <p
            className="text-sm capitalize"
            style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
          >
            {florals.density}
          </p>
        </div>
        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase mb-1"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            Native Formality
          </p>
          <p
            className="text-sm"
            style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
          >
            Level {florals.native_formality} / 5
          </p>
        </div>
      </div>
    </section>
  );
}
