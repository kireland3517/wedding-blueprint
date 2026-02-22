import type {
  AxisVector,
  BaseComponent,
  ConflictResult,
  FloralsComponent,
  MajorConflictKey,
  MinorTensionKey,
  PaletteComponent,
  ScoredComponent,
  AdjacentVariant as _AdjacentVariant,
} from "./types";

type Mood = import("./types").Mood;
type Texture = import("./types").Texture;
type FloralForm = import("./types").FloralForm;
type LightAtmosphere = import("./types").LightAtmosphere;

// ─── Tag → Axis Value Mapping ─────────────────────────────────────────────────

function axisMatchesTag(vector: AxisVector, tag: string): boolean {
  return (
    vector.mood === tag ||
    vector.texture === tag ||
    vector.temperature === tag ||
    vector.shape === tag ||
    vector.floral_form === tag ||
    vector.metal === tag ||
    vector.light === tag
  );
}

// ─── Affinity Scoring ─────────────────────────────────────────────────────────

export function computeAffinityScore(
  component: BaseComponent,
  vector: AxisVector
): number {
  let score = 0;
  const tags = component.axis_tags;

  if (tags.mood && tags.mood === vector.mood) score += 1;
  if (tags.texture && tags.texture === vector.texture) score += 1;
  if (tags.temperature && tags.temperature === vector.temperature) score += 1;
  if (tags.shape && tags.shape === vector.shape) score += 1;
  if (tags.floral_form && tags.floral_form === vector.floral_form) score += 1;
  if (tags.metal && tags.metal === vector.metal) score += 0.5;
  if (tags.light && tags.light === vector.light) score += 0.5;

  if (tags.formality !== undefined) {
    if (Array.isArray(tags.formality)) {
      const [min, max] = tags.formality;
      if (vector.formality >= min && vector.formality <= max) {
        const center = (min + max) / 2;
        const distance = Math.abs(vector.formality - center);
        score += Math.max(0, 1 - distance * 0.3);
      }
    } else {
      const distance = Math.abs(vector.formality - tags.formality);
      if (distance === 0) score += 1;
      else if (distance === 1) score += 0.5;
    }
  }

  return score;
}

// ─── Conflict Detection ───────────────────────────────────────────────────────

function hasPaletteTemperatureMismatch(
  vector: AxisVector,
  palette: PaletteComponent
): boolean {
  const paletteTemp = palette.axis_tags.temperature;
  if (!paletteTemp) return false;
  return (
    (vector.temperature === "warm" && paletteTemp === "cool") ||
    (vector.temperature === "cool" && paletteTemp === "warm")
  );
}

function hasShapeMismatch(vector: AxisVector): boolean {
  const floralImpliesOrganic = vector.floral_form === "meadow";
  const floralImpliesArchitectural = vector.floral_form === "sculptural";
  return (
    (vector.shape === "organic" && floralImpliesArchitectural) ||
    (vector.shape === "architectural" && floralImpliesOrganic)
  );
}

function hasMoodMismatch(vector: AxisVector): boolean {
  const textureImpliesRestrained = vector.texture === "minimal";
  const textureImpliesExpressive = vector.texture === "rich";
  return (
    (vector.mood === "expressive" && textureImpliesRestrained) ||
    (vector.mood === "restrained" && textureImpliesExpressive)
  );
}

function hasFormalityGap(vector: AxisVector, florals: FloralsComponent): boolean {
  return Math.abs(vector.formality - florals.native_formality) >= 2;
}

function hasMetalTemperatureTension(vector: AxisVector): boolean {
  return (
    (vector.temperature === "warm" && vector.metal === "cool") ||
    (vector.temperature === "cool" && vector.metal === "warm")
  );
}

function hasLightMoodTension(vector: AxisVector): boolean {
  return (
    (vector.light === "airy" && vector.mood === "expressive") ||
    (vector.light === "dramatic" && vector.mood === "restrained")
  );
}

function buildTensionNotes(minor: MinorTensionKey[], vector: AxisVector): string[] {
  const notes: string[] = [];
  if (minor.includes("metal-temperature-tension")) {
    const combo =
      vector.metal === "warm"
        ? "Warm metal (brass/gold) with a cool palette"
        : "Cool metal (silver/chrome) with a warm palette";
    notes.push(
      `${combo} creates intentional contrast. Use the contrasting metal as a sparingly-placed accent — flatware, a single hardware detail — not the dominant finish.`
    );
  }
  if (minor.includes("light-mood-contrast-tension")) {
    if (vector.light === "airy" && vector.mood === "expressive") {
      notes.push(
        "Airy daylight atmosphere with an expressive mood can dilute graphic impact. Consider layering some ambient candlelight at reception to reinforce the boldness."
      );
    } else {
      notes.push(
        "Dramatic low-light atmosphere with a restrained mood may feel heavy. Keep candle count moderate and favor tall tapers over wide pillars."
      );
    }
  }
  return notes;
}

export function detectConflicts(
  vector: AxisVector,
  palette: PaletteComponent,
  florals: FloralsComponent
): ConflictResult {
  const major: MajorConflictKey[] = [];
  const minor: MinorTensionKey[] = [];

  if (hasPaletteTemperatureMismatch(vector, palette))
    major.push("temperature-palette-mismatch");
  if (hasShapeMismatch(vector)) major.push("shape-mismatch");
  if (hasMoodMismatch(vector)) major.push("mood-mismatch");
  if (hasFormalityGap(vector, florals)) major.push("formality-gap");

  if (hasMetalTemperatureTension(vector)) minor.push("metal-temperature-tension");
  if (hasLightMoodTension(vector)) minor.push("light-mood-contrast-tension");

  return { major, minor, designTensionNotes: buildTensionNotes(minor, vector) };
}

// ─── Deterministic Component Selection ───────────────────────────────────────

export function selectComponent<T extends BaseComponent>(
  candidates: T[],
  vector: AxisVector
): T | null {
  const eligible = candidates.filter(
    (c) =>
      !c.compatibility.prohibited_tags.some((tag) => axisMatchesTag(vector, tag)) &&
      c.compatibility.required_tags.every((tag) => axisMatchesTag(vector, tag))
  );
  if (eligible.length === 0) return null;

  const scored: ScoredComponent<T>[] = eligible.map((c) => ({
    component: c,
    score: computeAffinityScore(c, vector),
    majorConflicts: 0,
    minorTensions: 0,
  }));

  scored.sort(
    (a, b) =>
      b.score - a.score ||
      a.majorConflicts - b.majorConflicts ||
      a.minorTensions - b.minorTensions ||
      a.component.id.localeCompare(b.component.id)
  );

  return scored[0].component;
}

// ─── Axis Step Utilities ──────────────────────────────────────────────────────

const MOOD_NEIGHBORS: Record<Mood, Mood[]> = {
  restrained: ["balanced"],
  balanced: ["restrained", "expressive"],
  expressive: ["balanced"],
};

const TEXTURE_NEIGHBORS: Record<Texture, Texture[]> = {
  minimal: ["layered"],
  layered: ["minimal", "rich"],
  rich: ["layered"],
};

const FLORAL_NEIGHBORS: Record<FloralForm, FloralForm[]> = {
  meadow: ["sculptural"],
  sculptural: ["meadow", "classic_dome"],
  classic_dome: ["sculptural"],
};

const LIGHT_NEIGHBORS: Record<LightAtmosphere, LightAtmosphere[]> = {
  airy: ["layered"],
  layered: ["airy", "dramatic"],
  dramatic: ["layered"],
};

// ─── Adjacent Vector Builder ──────────────────────────────────────────────────

function estimateMajorReduction(
  original: AxisVector,
  test: AxisVector,
  conflicts: ConflictResult
): number {
  let reduction = 0;
  if (conflicts.major.includes("mood-mismatch") && test.mood !== original.mood)
    reduction++;
  if (
    conflicts.major.includes("shape-mismatch") &&
    test.floral_form !== original.floral_form
  )
    reduction++;
  return reduction;
}

function estimateMinorReduction(
  original: AxisVector,
  test: AxisVector,
  conflicts: ConflictResult
): number {
  let reduction = 0;
  if (
    conflicts.minor.includes("light-mood-contrast-tension") &&
    test.light !== original.light
  )
    reduction++;
  return reduction;
}

export function buildAdjacentVector(
  vector: AxisVector,
  conflicts: ConflictResult
): Partial<AxisVector> {
  type Candidate = {
    axis: keyof AxisVector;
    newValue: string;
    majorReduction: number;
    minorReduction: number;
    isLight: boolean;
  };

  const candidates: Candidate[] = [];

  for (const newMood of MOOD_NEIGHBORS[vector.mood]) {
    candidates.push({
      axis: "mood",
      newValue: newMood,
      majorReduction: estimateMajorReduction(vector, { ...vector, mood: newMood }, conflicts),
      minorReduction: estimateMinorReduction(vector, { ...vector, mood: newMood }, conflicts),
      isLight: false,
    });
  }

  for (const newTexture of TEXTURE_NEIGHBORS[vector.texture]) {
    candidates.push({
      axis: "texture",
      newValue: newTexture,
      majorReduction: estimateMajorReduction(vector, { ...vector, texture: newTexture }, conflicts),
      minorReduction: estimateMinorReduction(vector, { ...vector, texture: newTexture }, conflicts),
      isLight: false,
    });
  }

  for (const newFloral of FLORAL_NEIGHBORS[vector.floral_form]) {
    candidates.push({
      axis: "floral_form",
      newValue: newFloral,
      majorReduction: estimateMajorReduction(vector, { ...vector, floral_form: newFloral }, conflicts),
      minorReduction: estimateMinorReduction(vector, { ...vector, floral_form: newFloral }, conflicts),
      isLight: false,
    });
  }

  for (const newLight of LIGHT_NEIGHBORS[vector.light]) {
    candidates.push({
      axis: "light",
      newValue: newLight,
      majorReduction: estimateMajorReduction(vector, { ...vector, light: newLight }, conflicts),
      minorReduction: estimateMinorReduction(vector, { ...vector, light: newLight }, conflicts),
      isLight: true,
    });
  }

  candidates.sort(
    (a, b) =>
      b.majorReduction - a.majorReduction ||
      b.minorReduction - a.minorReduction ||
      Number(a.isLight) - Number(b.isLight) ||
      a.axis.localeCompare(b.axis)
  );

  const shifts: Candidate[] = [];
  for (const c of candidates) {
    if (shifts.length === 0) {
      if (!c.isLight) shifts.push(c);
    } else if (shifts.length === 1) {
      if (c.axis !== shifts[0].axis) {
        shifts.push(c);
        break;
      }
    }
  }

  // Edge case: all candidates are light shifts
  if (shifts.length === 0 && candidates.length > 0) {
    shifts.push(candidates[0]);
  }

  const result: Partial<AxisVector> = {};
  for (const s of shifts) {
    (result as Record<string, string>)[s.axis] = s.newValue;
  }
  return result;
}

// ─── Do/Avoid List Generator ──────────────────────────────────────────────────

export function generateDoAvoidList(
  vector: AxisVector,
  conflicts: ConflictResult
): { doList: string[]; avoidList: string[] } {
  const doList: string[] = [];
  const avoidList: string[] = [];

  if (vector.temperature === "warm") {
    doList.push("Keep all palette applications in the warm register — creams, terracotta, ochre, blush");
    avoidList.push("Introducing cool-toned greys, blues, or silvers into the palette");
  } else if (vector.temperature === "cool") {
    doList.push("Maintain cool consistency across palette, metals, and print treatments");
    avoidList.push("Introducing warm accents — brass, terracotta, or golden tones");
  } else {
    doList.push("Use neutral as a versatile ground — it supports any metal temperature");
  }

  if (vector.mood === "restrained") {
    doList.push("Let negative space and material quality speak — restraint is the statement");
    avoidList.push("Adding decorative details that don't serve a structural purpose");
  } else if (vector.mood === "expressive") {
    doList.push("Commit fully to the contrast — half-measures dilute the impact");
    avoidList.push("Safe neutrals that undercut the graphic energy");
  }

  if (vector.shape === "architectural") {
    doList.push("Keep layouts geometric and intentional — strong horizontal and vertical alignments");
    avoidList.push("Organic or asymmetric arrangement in stationery layouts or signage");
  } else if (vector.shape === "organic") {
    doList.push("Embrace asymmetry and natural flow — no forced symmetry");
    avoidList.push("Rigid grid layouts or perfectly centered compositions");
  }

  if (vector.texture === "minimal") {
    doList.push("Choose one exceptional material and use it consistently across all surfaces");
    avoidList.push("Mixing multiple paper finishes or textile types");
  } else if (vector.texture === "rich") {
    doList.push("Layer textures intentionally — each surface should reward close inspection");
    avoidList.push("Flat digital-only print without any tactile dimension");
  }

  if (conflicts.minor.includes("metal-temperature-tension")) {
    avoidList.push(
      `Using ${vector.metal} metal as the dominant finish — apply it as a single sparingly-placed accent only`
    );
  }

  if (vector.formality >= 4) {
    doList.push("Invest in print quality — engraving, letterpress, or foil elevate the formality");
    avoidList.push("Digital flat-print on thin stock for any formal stationery piece");
  } else if (vector.formality <= 2) {
    doList.push("Let material authenticity carry the design — imperfection is appropriate here");
    avoidList.push("Over-polishing details to the point of losing warmth");
  }

  return { doList, avoidList };
}
