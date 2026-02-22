import type {
  AxisVector,
  Blueprint,
  AdjacentVariant,
  PaletteComponent,
  TypographyComponent,
  PaperPrintComponent,
  FloralsComponent,
  SignageComponent,
  Preset,
} from "./types";

import {
  selectComponent,
  detectConflicts,
  buildAdjacentVector,
  generateDoAvoidList,
} from "./conflicts";

import paletteLibrary from "./components/palette_library.json";
import typographyLibrary from "./components/typography_library.json";
import paperLibrary from "./components/paper_print_library.json";
import floralsLibrary from "./components/florals_library.json";
import signageLibrary from "./components/signage_library.json";

import presetAM from "./presets/architectural-minimal.json";
import presetRBT from "./presets/refined-black-tie.json";
import presetSRG from "./presets/soft-romantic-garden.json";
import presetETW from "./presets/earthy-textural-warmth.json";
import presetBGE from "./presets/bold-graphic-editorial.json";

const ALL_PRESETS: Preset[] = [presetAM, presetRBT, presetSRG, presetETW, presetBGE] as Preset[];

// ─── Preset Resolution ────────────────────────────────────────────────────────

function resolvePreset(vector: AxisVector): string | null {
  // Score each preset by axis match, eliminate if 2+ major conflicts
  const scored = ALL_PRESETS.map((preset) => {
    const pv = preset.axisVector;
    let score = 0;
    let majorMismatches = 0;

    if (pv.mood === vector.mood) score += 2;
    else if (
      (pv.mood === "expressive" && vector.mood === "restrained") ||
      (pv.mood === "restrained" && vector.mood === "expressive")
    )
      majorMismatches++;

    if (pv.texture === vector.texture) score += 1;
    if (pv.temperature === vector.temperature) score += 2;
    else if (
      (pv.temperature === "warm" && vector.temperature === "cool") ||
      (pv.temperature === "cool" && vector.temperature === "warm")
    )
      majorMismatches++;

    if (pv.shape === vector.shape) score += 2;
    else if (
      (pv.shape === "organic" && vector.shape === "architectural") ||
      (pv.shape === "architectural" && vector.shape === "organic")
    )
      majorMismatches++;

    if (pv.floral_form === vector.floral_form) score += 1;
    if (pv.metal === vector.metal) score += 0.5;
    if (pv.light === vector.light) score += 0.5;

    const formalityDiff = Math.abs(pv.formality - vector.formality);
    if (formalityDiff === 0) score += 2;
    else if (formalityDiff === 1) score += 1;
    else if (formalityDiff >= 2) majorMismatches++;

    return { preset, score, majorMismatches };
  });

  const eligible = scored.filter((s) => s.majorMismatches < 2);
  if (eligible.length === 0) return null;

  eligible.sort(
    (a, b) =>
      b.score - a.score ||
      a.majorMismatches - b.majorMismatches ||
      a.preset.id.localeCompare(b.preset.id)
  );

  return eligible[0].preset.id;
}

// ─── Adjacent Variant Assembly ────────────────────────────────────────────────

function buildAdjacentImplications(
  original: AxisVector,
  shifted: Partial<AxisVector>
): [string, string, string] {
  const changes = Object.keys(shifted) as (keyof AxisVector)[];
  const implications: string[] = [];

  if (changes.includes("floral_form")) {
    const newForm = shifted.floral_form;
    if (newForm === "sculptural")
      implications.push(
        "Florals: shift toward single-stem sculptural arrangements with intentional negative space"
      );
    else if (newForm === "meadow")
      implications.push(
        "Florals: soften to loose, garden-gathered arrangements with trailing foliage"
      );
    else if (newForm === "classic_dome")
      implications.push(
        "Florals: move toward lush symmetrical domes — increases formality of the floral program"
      );
  }

  if (changes.includes("mood")) {
    const newMood = shifted.mood;
    if (newMood === "balanced")
      implications.push(
        "Signage: introduce one point of personality — a single decorative detail or unexpected material — without changing the overall system"
      );
    else if (newMood === "restrained")
      implications.push(
        "Signage: strip back to the essential information only — one material, no decorative additions"
      );
    else if (newMood === "expressive")
      implications.push(
        "Signage: amplify contrast — larger scale, bolder type weight, or an unexpected material accent"
      );
  }

  if (changes.includes("texture")) {
    const newTex = shifted.texture;
    if (newTex === "layered")
      implications.push(
        "Signage & florals: introduce one textile or tactile layer — a linen backing, a ribbon, or mixed surface signage"
      );
    else if (newTex === "minimal")
      implications.push(
        "Signage & florals: simplify surfaces — remove secondary materials and commit to one dominant texture"
      );
    else if (newTex === "rich")
      implications.push(
        "Signage & florals: add material depth — velvet ribbon, heavy fabric backing, layered florals with visible stems"
      );
  }

  if (changes.includes("light")) {
    const newLight = shifted.light;
    if (newLight === "dramatic")
      implications.push(
        "Atmosphere: increase candle density — tall tapers in clusters, low ambient overhead. Reduce reflective surfaces."
      );
    else if (newLight === "airy")
      implications.push(
        "Atmosphere: reduce candle count, favor daylight and diffused ambient. Use reflective surfaces sparingly."
      );
    else if (newLight === "layered")
      implications.push(
        "Atmosphere: mix candle and ambient light — pillar candles with overhead diffused lighting for a balanced mood."
      );
  }

  // Pad to exactly 3 if fewer changes
  const fallbacks = [
    "Florals: maintain the selected form but introduce one seasonal wildcard stem for personality",
    "Signage: ensure all materials in the signage system share the same finish language — no mixing sheen and matte",
    "Atmosphere: layer candlelight at the reception even if ceremony is daylight — it shifts the energy effectively",
  ];
  while (implications.length < 3) {
    implications.push(fallbacks[implications.length]);
  }

  return [implications[0], implications[1], implications[2]];
}

export function assembleAdjacentVariant(
  vector: AxisVector,
  conflicts: ReturnType<typeof detectConflicts>
): AdjacentVariant {
  const shiftedAxes = buildAdjacentVector(vector, conflicts);
  const adjacentVector: AxisVector = { ...vector, ...shiftedAxes };

  const palette = selectComponent(paletteLibrary as unknown as PaletteComponent[], adjacentVector)!;
  const typography = selectComponent(typographyLibrary as unknown as TypographyComponent[], adjacentVector)!;
  const paper_print = selectComponent(paperLibrary as unknown as PaperPrintComponent[], adjacentVector)!;

  const implications = buildAdjacentImplications(vector, shiftedAxes);

  return { shiftedAxes, sections: { palette, typography, paper_print }, implications };
}

// ─── Main Blueprint Assembly ──────────────────────────────────────────────────

export function assembleBlueprint(vector: AxisVector): Blueprint {
  // Step 1: Select components for each section
  const palette = selectComponent(paletteLibrary as unknown as PaletteComponent[], vector);
  const typography = selectComponent(typographyLibrary as unknown as TypographyComponent[], vector);
  const paper_print = selectComponent(paperLibrary as unknown as PaperPrintComponent[], vector);
  const florals = selectComponent(floralsLibrary as unknown as FloralsComponent[], vector);
  const signage = selectComponent(signageLibrary as unknown as SignageComponent[], vector);

  if (!palette || !typography || !paper_print || !florals || !signage) {
    throw new Error("Assembly failed: one or more component libraries returned no eligible match");
  }

  // Step 2: Detect conflicts (requires palette + florals to be selected first)
  const conflicts = detectConflicts(vector, palette, florals);

  // Step 3: Resolve named lane
  const resolvedPreset = resolvePreset(vector);

  // Step 4: Generate do/avoid list
  const { doList, avoidList } = generateDoAvoidList(vector, conflicts);

  return {
    axisVector: vector,
    resolvedPreset,
    sections: { palette, typography, paper_print, florals, signage },
    conflicts,
    doList,
    avoidList,
  };
}
