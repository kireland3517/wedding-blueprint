import { SectionLabel } from "./PalettePanel";

interface Props {
  doList: string[];
  avoidList: string[];
  tensionNotes: string[];
}

export default function DoAvoidList({ doList, avoidList, tensionNotes }: Props) {
  return (
    <section className="mb-12">
      <SectionLabel number="—" title="Do & Avoid" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Do */}
        <div>
          <p
            className="text-xs tracking-[0.2em] uppercase mb-4"
            style={{ color: "var(--foreground)", fontFamily: "Arial, sans-serif" }}
          >
            Do
          </p>
          <ul className="space-y-3">
            {doList.map((item, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed flex gap-3"
                style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
              >
                <span style={{ color: "var(--accent)", flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Avoid */}
        <div>
          <p
            className="text-xs tracking-[0.2em] uppercase mb-4"
            style={{ color: "var(--foreground)", fontFamily: "Arial, sans-serif" }}
          >
            Avoid
          </p>
          <ul className="space-y-3">
            {avoidList.map((item, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed flex gap-3"
                style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
              >
                <span style={{ color: "var(--muted)", flexShrink: 0 }}>✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Design tension notes */}
      {tensionNotes.length > 0 && (
        <div
          className="p-5"
          style={{ border: "1px solid var(--border)", background: "#fefcfa" }}
        >
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            Design Tension
          </p>
          <ul className="space-y-3">
            {tensionNotes.map((note, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed"
                style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
              >
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
