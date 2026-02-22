import type { SignageComponent } from "@/lib/types";
import { SectionLabel } from "./PalettePanel";

interface Props {
  signage: SignageComponent;
}

export default function SignagePanel({ signage }: Props) {
  return (
    <section className="mb-12">
      <SectionLabel number="05" title="Signage System" />
      <h3
        className="text-xl font-normal mb-2"
        style={{ fontFamily: "Georgia, serif", color: "var(--foreground)" }}
      >
        {signage.name}
      </h3>
      <p
        className="text-sm mb-6 leading-relaxed"
        style={{ fontFamily: "Arial, sans-serif", color: "var(--muted)" }}
      >
        {signage.lettering_style}
      </p>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase mb-3"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            Materials
          </p>
          <ul className="space-y-1">
            {signage.materials.map((m, i) => (
              <li
                key={i}
                className="text-sm"
                style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
              >
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase mb-3"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            Hardware
          </p>
          <ul className="space-y-1">
            {signage.hardware.map((h, i) => (
              <li
                key={i}
                className="text-sm"
                style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
              >
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <p
          className="text-xs tracking-[0.15em] uppercase mb-2"
          style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
        >
          Finishes
        </p>
        <ul className="space-y-1">
          {signage.finishes.map((f, i) => (
            <li
              key={i}
              className="text-sm flex gap-3"
              style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
            >
              <span style={{ color: "var(--muted)" }}>—</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
