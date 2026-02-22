import type { PaperPrintComponent } from "@/lib/types";
import { SectionLabel } from "./PalettePanel";

interface Props {
  paper: PaperPrintComponent;
}

export default function PaperPanel({ paper }: Props) {
  return (
    <section className="mb-12">
      <SectionLabel number="03" title="Paper & Print" />
      <h3
        className="text-xl font-normal mb-6"
        style={{ fontFamily: "Georgia, serif", color: "var(--foreground)" }}
      >
        {paper.name}
      </h3>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase mb-2"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            Stock
          </p>
          <p
            className="text-sm"
            style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
          >
            {paper.stock}
          </p>
        </div>
        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase mb-2"
            style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
          >
            Weight
          </p>
          <p
            className="text-sm"
            style={{ fontFamily: "Arial, sans-serif", color: "var(--foreground)" }}
          >
            {paper.weight}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p
          className="text-xs tracking-[0.15em] uppercase mb-2"
          style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
        >
          Print Technique
        </p>
        <div className="flex flex-wrap gap-2">
          {paper.technique.map((t, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs"
              style={{
                border: "1px solid var(--border)",
                fontFamily: "Arial, sans-serif",
                color: "var(--foreground)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p
          className="text-xs tracking-[0.15em] uppercase mb-2"
          style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
        >
          Finishes & Details
        </p>
        <ul className="space-y-1">
          {paper.finishes.map((f, i) => (
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
