// ─── Axis Types ───────────────────────────────────────────────────────────────

export type Mood = "restrained" | "balanced" | "expressive";
export type Texture = "minimal" | "layered" | "rich";
export type Temperature = "warm" | "cool" | "neutral";
export type ShapeLanguage = "organic" | "balanced" | "architectural";
export type FloralForm = "meadow" | "sculptural" | "classic_dome";
export type MetalTemp = "cool" | "warm" | "mixed";
export type LightAtmosphere = "airy" | "layered" | "dramatic";
export type ContrastLevel = "low" | "medium" | "high";
export type Density = "airy" | "medium" | "lush";

export interface AxisVector {
  formality: 1 | 2 | 3 | 4 | 5;
  mood: Mood;
  texture: Texture;
  temperature: Temperature;
  shape: ShapeLanguage;
  floral_form: FloralForm;
  metal: MetalTemp;
  light: LightAtmosphere;
}

// ─── Component Types ──────────────────────────────────────────────────────────

export interface ComponentAxisTags {
  formality?: number | [number, number]; // exact value or [min, max] range
  mood?: Mood;
  texture?: Texture;
  temperature?: Temperature;
  shape?: ShapeLanguage;
  floral_form?: FloralForm;
  metal?: MetalTemp;
  light?: LightAtmosphere;
}

export interface Compatibility {
  prohibited_tags: string[];
  required_tags: string[];
  notes: string;
}

export interface BaseComponent {
  id: string;
  name: string;
  section: "palette" | "typography" | "paper_print" | "florals" | "signage";
  axis_tags: ComponentAxisTags;
  compatibility: Compatibility;
}

export interface PaletteComponent extends BaseComponent {
  section: "palette";
  swatches: string[];
  usage_rules: string[];
  contrast_level: ContrastLevel;
}

export interface TypographyComponent extends BaseComponent {
  section: "typography";
  heading_font: string;
  body_font: string;
  accent_font: string | null;
  hierarchy_notes: string[];
}

export interface PaperPrintComponent extends BaseComponent {
  section: "paper_print";
  stock: string;
  weight: string;
  technique: string[];
  finishes: string[];
}

export interface FloralsComponent extends BaseComponent {
  section: "florals";
  key_flowers: string[];
  foliage: string[];
  arrangement_style: string;
  density: Density;
  native_formality: number;
}

export interface SignageComponent extends BaseComponent {
  section: "signage";
  materials: string[];
  lettering_style: string;
  hardware: string[];
  finishes: string[];
}

// ─── Blueprint Types ──────────────────────────────────────────────────────────

export interface Blueprint {
  axisVector: AxisVector;
  resolvedPreset: string | null; // preset id or null if no clean match
  sections: {
    palette: PaletteComponent;
    typography: TypographyComponent;
    paper_print: PaperPrintComponent;
    florals: FloralsComponent;
    signage: SignageComponent;
  };
  conflicts: ConflictResult;
  doList: string[];
  avoidList: string[];
}

export interface AdjacentVariant {
  shiftedAxes: Partial<AxisVector>;
  sections: {
    palette: PaletteComponent;
    typography: TypographyComponent;
    paper_print: PaperPrintComponent;
  };
  implications: [string, string, string]; // exactly 3 bullet strings
}

// ─── Conflict Types ───────────────────────────────────────────────────────────

export type MajorConflictKey =
  | "temperature-palette-mismatch"
  | "shape-mismatch"
  | "mood-mismatch"
  | "formality-gap";

export type MinorTensionKey =
  | "metal-temperature-tension"
  | "light-mood-contrast-tension"
  | "texture-formality-tension";

export interface ConflictResult {
  major: MajorConflictKey[];
  minor: MinorTensionKey[];
  designTensionNotes: string[];
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export interface ScoredComponent<T extends BaseComponent> {
  component: T;
  score: number;
  majorConflicts: number;
  minorTensions: number;
}

// ─── Preset Types ─────────────────────────────────────────────────────────────

export interface Preset {
  id: string;
  name: string;
  tagline: string;
  axisVector: AxisVector;
  avoid_summary: string[];
}

// ─── Log Entry ────────────────────────────────────────────────────────────────

export interface LogEntry {
  timestamp: string;
  inputAnswers: Partial<AxisVector>;
  axisVector: AxisVector;
  chosenComponentIds: {
    palette: string;
    typography: string;
    paper_print: string;
    florals: string;
    signage: string;
  };
  conflicts: MajorConflictKey[];
  tensions: MinorTensionKey[];
}
