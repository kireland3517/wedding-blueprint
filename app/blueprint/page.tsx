"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { assembleBlueprint, assembleAdjacentVariant } from "@/lib/assembly";
import { logGeneration } from "@/lib/logging";
import type { AxisVector, Blueprint, AdjacentVariant } from "@/lib/types";
import PalettePanel from "@/components/blueprint/PalettePanel";
import TypographyPanel from "@/components/blueprint/TypographyPanel";
import PaperPanel from "@/components/blueprint/PaperPanel";
import FloralsPanel from "@/components/blueprint/FloralsPanel";
import SignagePanel from "@/components/blueprint/SignagePanel";
import DoAvoidList from "@/components/blueprint/DoAvoidList";
import AdjacentSidebar from "@/components/blueprint/AdjacentSidebar";

const PRESET_LABELS: Record<string, string> = {
  "architectural-minimal": "Architectural Minimal",
  "refined-black-tie": "Refined Black Tie",
  "soft-romantic-garden": "Soft Romantic Garden",
  "earthy-textural-warmth": "Earthy Textural Warmth",
  "bold-graphic-editorial": "Bold Graphic Editorial",
};

function parseAxisVector(params: URLSearchParams): AxisVector | null {
  const formality = parseInt(params.get("formality") ?? "");
  const mood = params.get("mood");
  const texture = params.get("texture");
  const temperature = params.get("temperature");
  const shape = params.get("shape");
  const floral_form = params.get("floral_form");
  const metal = params.get("metal");
  const light = params.get("light");

  if (
    !formality || isNaN(formality) ||
    !mood || !texture || !temperature ||
    !shape || !floral_form || !metal || !light
  )
    return null;

  return {
    formality: Math.min(5, Math.max(1, formality)) as 1 | 2 | 3 | 4 | 5,
    mood: mood as AxisVector["mood"],
    texture: texture as AxisVector["texture"],
    temperature: temperature as AxisVector["temperature"],
    shape: shape as AxisVector["shape"],
    floral_form: floral_form as AxisVector["floral_form"],
    metal: metal as AxisVector["metal"],
    light: light as AxisVector["light"],
  };
}

function BlueprintContent() {
  const params = useSearchParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const vector = parseAxisVector(params);

  if (!vector) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="text-center">
          <p className="mb-6" style={{ fontFamily: "Georgia, serif", color: "var(--muted)" }}>
            No blueprint data found.
          </p>
          <button
            onClick={() => router.push("/quiz")}
            className="px-8 py-3 text-sm"
            style={{
              background: "var(--foreground)",
              color: "var(--background)",
              fontFamily: "Arial, sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Take the Quiz
          </button>
        </div>
      </div>
    );
  }

  let blueprint: Blueprint;
  let adjacent: AdjacentVariant;
  try {
    blueprint = assembleBlueprint(vector);
    adjacent = assembleAdjacentVariant(vector, blueprint.conflicts);
  } catch (e) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <p style={{ fontFamily: "Georgia, serif", color: "var(--muted)" }}>
          Assembly error — please retake the quiz.
        </p>
      </div>
    );
  }

  // Log on mount
  useEffect(() => {
    logGeneration(vector, blueprint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePdfExport() {
    if (!printRef.current) return;
    setPdfLoading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { default: jsPDF } = await import("jspdf");

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#faf9f7",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let yOffset = 0;
      let remaining = imgHeight;

      while (remaining > 0) {
        pdf.addImage(imgData, "PNG", 0, -yOffset, imgWidth, imgHeight);
        remaining -= pageHeight;
        yOffset += pageHeight;
        if (remaining > 0) pdf.addPage();
      }

      pdf.save(`wedding-blueprint-${blueprint.resolvedPreset ?? "custom"}.pdf`);
    } finally {
      setPdfLoading(false);
    }
  }

  const laneLabel = blueprint.resolvedPreset
    ? PRESET_LABELS[blueprint.resolvedPreset]
    : null;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-8 py-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <button
          onClick={() => router.push("/quiz")}
          className="text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-50"
          style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
        >
          ← Retake
        </button>
        <button
          onClick={handlePdfExport}
          disabled={pdfLoading}
          className="text-xs tracking-[0.15em] uppercase px-6 py-2 transition-opacity hover:opacity-80 disabled:opacity-40"
          style={{
            background: "var(--foreground)",
            color: "var(--background)",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {pdfLoading ? "Generating…" : "Export PDF"}
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Blueprint header */}
        <div ref={printRef}>
          <div className="mb-14 text-center">
            <p
              className="text-xs tracking-[0.25em] uppercase mb-4"
              style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
            >
              Your Wedding Design Blueprint
            </p>
            {laneLabel && (
              <p
                className="text-3xl font-normal mb-2"
                style={{ fontFamily: "Georgia, serif", color: "var(--foreground)" }}
              >
                <em>{laneLabel}</em>
              </p>
            )}
            {!laneLabel && (
              <p
                className="text-3xl font-normal mb-2"
                style={{ fontFamily: "Georgia, serif", color: "var(--foreground)" }}
              >
                <em>Custom Direction</em>
              </p>
            )}
            <p
              className="text-sm"
              style={{ color: "var(--muted)", fontFamily: "Arial, sans-serif" }}
            >
              {blueprint.conflicts.major.length > 0
                ? `${blueprint.conflicts.major.length} design tension${blueprint.conflicts.major.length > 1 ? "s" : ""} noted below`
                : "Cohesive — no major conflicts"}
            </p>
          </div>

          {/* Axis summary chips */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {Object.entries(vector).map(([key, value]) => (
              <span
                key={key}
                className="px-3 py-1 text-xs"
                style={{
                  border: "1px solid var(--border)",
                  fontFamily: "Arial, sans-serif",
                  color: "var(--muted)",
                }}
              >
                {key.replace("_", " ")}: <strong style={{ color: "var(--foreground)" }}>{String(value)}</strong>
              </span>
            ))}
          </div>

          {/* Two-column layout: main + adjacent */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main blueprint — 2/3 width */}
            <div className="lg:col-span-2">
              <PalettePanel palette={blueprint.sections.palette} />
              <TypographyPanel typography={blueprint.sections.typography} />
              <PaperPanel paper={blueprint.sections.paper_print} />
              <FloralsPanel florals={blueprint.sections.florals} />
              <SignagePanel signage={blueprint.sections.signage} />
              <DoAvoidList
                doList={blueprint.doList}
                avoidList={blueprint.avoidList}
                tensionNotes={blueprint.conflicts.designTensionNotes}
              />
            </div>

            {/* Adjacent sidebar — 1/3 width */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <AdjacentSidebar adjacent={adjacent} originalVector={vector} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlueprintPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "var(--background)" }}
        >
          <p style={{ fontFamily: "Georgia, serif", color: "var(--muted)" }}>
            Building your blueprint…
          </p>
        </div>
      }
    >
      <BlueprintContent />
    </Suspense>
  );
}
