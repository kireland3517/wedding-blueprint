import type { AdjacentVariant, AxisVector } from "@/lib/types";

interface Props {
  adjacent: AdjacentVariant;
  originalVector: AxisVector;
}

const AXIS_LABELS: Record<string, string> = {
  mood: "Mood",
  texture: "Texture",
  floral_form: "Floral Form",
  light: "Light Atmosphere",
};

export default function AdjacentSidebar({ adjacent, originalVector }: Props) {
  const shiftedKeys = Object.keys(adjacent.shiftedAxes) as (keyof AxisVector)[];

  return (
    <aside
      className="p-6"
      style={{
        border: "1px solid var(--border)",
        background: "#f8f6f2",
      }}
    >
      <p
        className="text-xs tracking-[0.2em] uppercase mb-1"
        style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
      >
        Refinement Option
      </p>
      <p
        className="text-sm mb-5 leading-relaxed"
        style={{ fontFamily: "Arial, sans-serif", color: "var(--muted)" }}
      >
        A controlled adjacent direction — shifts{" "}
        {shiftedKeys.map((k) => AXIS_LABELS[k] ?? k).join(" and ")} by one step.
      </p>

      {/* What shifted */}
      <div className="mb-6">
        {shiftedKeys.map((key) => (
          <div key={key} className="flex items-center gap-3 mb-2">
            <span
              className="text-xs uppercase tracking-wide"
              style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
            >
              {AXIS_LABELS[key] ?? key}:
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
            >
              <span className="line-through">{String(originalVector[key])}</span>
              {" → "}
              <strong style={{ color: "var(--foreground)" }}>
                {String(adjacent.shiftedAxes[key])}
              </strong>
            </span>
          </div>
        ))}
      </div>

      {/* Regenerated sections */}
      <div className="mb-6 space-y-4">
        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase mb-2"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            Alternate Palette
          </p>
          <div className="flex gap-2">
            {adjacent.sections.palette.swatches.map((hex, i) => (
              <div
                key={i}
                className="swatch"
                style={{ background: hex, width: "2rem", height: "2rem" }}
                title={hex}
              />
            ))}
          </div>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            {adjacent.sections.palette.name}
          </p>
        </div>

        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase mb-1"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            Alternate Typography
          </p>
          <p
            className="text-sm"
            style={{ fontFamily: "Georgia, serif", color: "var(--foreground)" }}
          >
            {adjacent.sections.typography.heading_font}
          </p>
          <p
            className="text-xs"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            + {adjacent.sections.typography.body_font}
          </p>
        </div>

        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase mb-1"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            Alternate Paper
          </p>
          <p
            className="text-sm"
            style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
          >
            {adjacent.sections.paper_print.name}
          </p>
        </div>
      </div>

      {/* 3 bullet implications */}
      <div>
        <p
          className="text-xs tracking-[0.15em] uppercase mb-3"
          style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
        >
          Florals & Signage Implications
        </p>
        <ul className="space-y-2">
          {adjacent.implications.map((imp, i) => (
            <li
              key={i}
              className="text-xs leading-relaxed flex gap-2"
              style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
            >
              <span style={{ color: "var(--muted)", flexShrink: 0 }}>·</span>
              {imp}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
