import type { AxisVector } from "./types";

export interface QuizOption {
  value: string;
  label: string;
  description: string;
}

export interface QuizQuestion {
  axis: keyof AxisVector;
  step: number;
  heading: string;
  subheading: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    axis: "formality",
    step: 1,
    heading: "How formal is your day?",
    subheading: "This shapes everything from paper weight to floral structure.",
    options: [
      {
        value: "1",
        label: "Relaxed",
        description: "Casual, intimate, no dress code required.",
      },
      {
        value: "2",
        label: "Dressed up",
        description: "Elevated but approachable — cocktail attire energy.",
      },
      {
        value: "3",
        label: "Elevated",
        description: "Polished and considered throughout, without rigidity.",
      },
      {
        value: "4",
        label: "Formal",
        description: "Black tie optional — ceremony and reception feel curated.",
      },
      {
        value: "5",
        label: "Black Tie",
        description: "Full formality — everything is deliberate and grand.",
      },
    ],
  },
  {
    axis: "mood",
    step: 2,
    heading: "What's the emotional register?",
    subheading: "How much personality and contrast do you want in the design?",
    options: [
      {
        value: "restrained",
        label: "Restrained",
        description: "Calm, tonal, controlled — let quality and space speak.",
      },
      {
        value: "balanced",
        label: "Balanced",
        description: "Personality without drama — refined but not blank.",
      },
      {
        value: "expressive",
        label: "Expressive",
        description: "Bold, graphic, high impact — the design makes a statement.",
      },
    ],
  },
  {
    axis: "texture",
    step: 3,
    heading: "How tactile is your vision?",
    subheading: "Think about paper, linens, surfaces — what do you want guests to feel?",
    options: [
      {
        value: "minimal",
        label: "Smooth & Minimal",
        description: "Matte, clean, unembellished. One exceptional material.",
      },
      {
        value: "layered",
        label: "Layered",
        description: "Linen, silk, mixed textiles — surfaces have depth.",
      },
      {
        value: "rich",
        label: "Rich",
        description: "Velvet, heavy cotton, visible material weight everywhere.",
      },
    ],
  },
  {
    axis: "temperature",
    step: 4,
    heading: "Is your palette warm, cool, or neutral?",
    subheading: "This is the single most important choice — it anchors everything else.",
    options: [
      {
        value: "warm",
        label: "Warm",
        description: "Creams, terracotta, blush, ochre, brass.",
      },
      {
        value: "cool",
        label: "Cool",
        description: "Slate, stone, silver, dusty blue, platinum.",
      },
      {
        value: "neutral",
        label: "Neutral",
        description: "Ivory, taupe, warm white, graphite — neither direction.",
      },
    ],
  },
  {
    axis: "shape",
    step: 5,
    heading: "What shape language feels right?",
    subheading: "This governs layouts, signage silhouettes, and floral form.",
    options: [
      {
        value: "organic",
        label: "Organic",
        description: "Curved, asymmetrical, natural flow. No rigid grids.",
      },
      {
        value: "balanced",
        label: "Balanced",
        description: "Softened structure — shape with a human touch.",
      },
      {
        value: "architectural",
        label: "Architectural",
        description: "Linear, geometric, intentional. Strong horizontals and verticals.",
      },
    ],
  },
  {
    axis: "floral_form",
    step: 6,
    heading: "What's your floral direction?",
    subheading: "Arrangement style determines density, structure, and the overall energy of florals.",
    options: [
      {
        value: "meadow",
        label: "Meadow",
        description: "Loose, airy, as if gathered. Trailing greenery, mixed stems.",
      },
      {
        value: "sculptural",
        label: "Sculptural",
        description: "Intentional, single-stem focus, negative space. Modern.",
      },
      {
        value: "classic_dome",
        label: "Classic Dome",
        description: "Lush, symmetrical, full. The traditional formal centerpiece.",
      },
    ],
  },
  {
    axis: "metal",
    step: 7,
    heading: "Which metal temperature feels right?",
    subheading: "Appears in foil treatment, flatware, hardware, candle holders.",
    options: [
      {
        value: "cool",
        label: "Cool — Silver & Chrome",
        description: "Brushed silver, platinum, gunmetal, polished chrome.",
      },
      {
        value: "warm",
        label: "Warm — Gold & Brass",
        description: "Antique brass, burnished gold, rose gold.",
      },
      {
        value: "mixed",
        label: "Mixed",
        description: "Antiqued blends, no strict metal rule — editorial freedom.",
      },
    ],
  },
  {
    axis: "light",
    step: 8,
    heading: "What's the light atmosphere?",
    subheading: "Affects palette contrast preference and overall mood intensity.",
    options: [
      {
        value: "airy",
        label: "Airy",
        description: "Daylight-driven, open, soft diffusion. Lower contrast.",
      },
      {
        value: "layered",
        label: "Layered",
        description: "Ambient plus candlelight mix. Balanced contrast.",
      },
      {
        value: "dramatic",
        label: "Dramatic",
        description: "Low glow, high contrast, moody. Strong shadows.",
      },
    ],
  },
];
