export type DesignPresetId =
  | "custom"
  | "dawn"
  | "electric"
  | "forest"
  | "grey"
  | "vibrant"
  | "neon"
  | "vanilla"
  | "love"
  | "earth"
  | "valentine"
  | "bubble_gum"
  | "black_yellow"
  | "sophisticated"
  | "fire"
  | "frost"
  | "sunny_evening"
  | "red_moon"
  | "dark_ocean"
  | "minimal";

export interface DesignPresetColors {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
}

export interface DesignPreset {
  id: DesignPresetId;
  label: string;
  description: string;
  colors: DesignPresetColors;
}

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: "custom",
    label: "Custom",
    description: "Build your own color palette from scratch.",
    colors: {
      backgroundColor: "#ffffff",
      textColor: "#111827",
      buttonColor: "#111827",
      buttonTextColor: "#ffffff",
    },
  },
  {
    id: "dawn",
    label: "Dawn",
    description: "Warm sunrise tones — soft, inviting, and optimistic.",
    colors: {
      backgroundColor: "#FFF5F0",
      textColor: "#7C2D12",
      buttonColor: "#EA580C",
      buttonTextColor: "#FFFFFF",
    },
  },
  {
    id: "electric",
    label: "Electric",
    description: "High-energy blue with cyan accents — bold and modern.",
    colors: {
      backgroundColor: "#0066FF",
      textColor: "#FFFFFF",
      buttonColor: "#00E5FF",
      buttonTextColor: "#001A33",
    },
  },
  {
    id: "forest",
    label: "Forest",
    description: "Deep evergreen with fresh sage — natural and trustworthy.",
    colors: {
      backgroundColor: "#1B4332",
      textColor: "#D8F3DC",
      buttonColor: "#52B788",
      buttonTextColor: "#1B4332",
    },
  },
  {
    id: "grey",
    label: "50 Shades of Grey",
    description: "Refined monochrome — sleek and professional.",
    colors: {
      backgroundColor: "#374151",
      textColor: "#F9FAFB",
      buttonColor: "#9CA3AF",
      buttonTextColor: "#111827",
    },
  },
  {
    id: "vibrant",
    label: "Vibrant",
    description: "Purple base with pink CTA — playful and eye-catching.",
    colors: {
      backgroundColor: "#7C3AED",
      textColor: "#FFFFFF",
      buttonColor: "#F472B6",
      buttonTextColor: "#4C1D95",
    },
  },
  {
    id: "neon",
    label: "Neon",
    description: "Dark canvas with neon green — edgy and tech-forward.",
    colors: {
      backgroundColor: "#0A0A0A",
      textColor: "#39FF14",
      buttonColor: "#39FF14",
      buttonTextColor: "#0A0A0A",
    },
  },
  {
    id: "vanilla",
    label: "Vanilla",
    description: "Warm cream and cocoa — cozy lifestyle aesthetic.",
    colors: {
      backgroundColor: "#FAF7F2",
      textColor: "#5C4033",
      buttonColor: "#8B6914",
      buttonTextColor: "#FAF7F2",
    },
  },
  {
    id: "love",
    label: "Love",
    description: "Rich crimson with blush accents — passionate and warm.",
    colors: {
      backgroundColor: "#BE123C",
      textColor: "#FFF1F2",
      buttonColor: "#FDA4AF",
      buttonTextColor: "#881337",
    },
  },
  {
    id: "earth",
    label: "Earth",
    description: "Stone and amber — organic, grounded, and artisanal.",
    colors: {
      backgroundColor: "#78716C",
      textColor: "#FAFAF9",
      buttonColor: "#D97706",
      buttonTextColor: "#451A03",
    },
  },
  {
    id: "valentine",
    label: "Valentine",
    description: "Soft pink with rose CTA — romantic and seasonal.",
    colors: {
      backgroundColor: "#FDF2F8",
      textColor: "#9D174D",
      buttonColor: "#EC4899",
      buttonTextColor: "#FFFFFF",
    },
  },
  {
    id: "bubble_gum",
    label: "Bubble Gum",
    description: "Candy pink with lavender button — fun and youthful.",
    colors: {
      backgroundColor: "#FF6B9D",
      textColor: "#FFFFFF",
      buttonColor: "#C084FC",
      buttonTextColor: "#FFFFFF",
    },
  },
  {
    id: "black_yellow",
    label: "Black and Yellow",
    description: "Maximum contrast — urgent sales and flash deals.",
    colors: {
      backgroundColor: "#000000",
      textColor: "#FACC15",
      buttonColor: "#FACC15",
      buttonTextColor: "#000000",
    },
  },
  {
    id: "sophisticated",
    label: "Sophisticated",
    description: "Navy slate with gold CTA — premium and luxury.",
    colors: {
      backgroundColor: "#1E293B",
      textColor: "#E2E8F0",
      buttonColor: "#CA8A04",
      buttonTextColor: "#1E293B",
    },
  },
  {
    id: "fire",
    label: "Fire",
    description: "Red-orange intensity — perfect for hot deals.",
    colors: {
      backgroundColor: "#DC2626",
      textColor: "#FEF2F2",
      buttonColor: "#F97316",
      buttonTextColor: "#FFFFFF",
    },
  },
  {
    id: "frost",
    label: "Frost",
    description: "Icy blue on white — clean, cool, and refreshing.",
    colors: {
      backgroundColor: "#F0F9FF",
      textColor: "#0369A1",
      buttonColor: "#0EA5E9",
      buttonTextColor: "#FFFFFF",
    },
  },
  {
    id: "sunny_evening",
    label: "Sunny Evening",
    description: "Golden hour amber — warm and cheerful.",
    colors: {
      backgroundColor: "#FBBF24",
      textColor: "#78350F",
      buttonColor: "#92400E",
      buttonTextColor: "#FFFBEB",
    },
  },
  {
    id: "red_moon",
    label: "Red Moon",
    description: "Deep burgundy night — dramatic and moody.",
    colors: {
      backgroundColor: "#450A0A",
      textColor: "#FECACA",
      buttonColor: "#EF4444",
      buttonTextColor: "#FFFFFF",
    },
  },
  {
    id: "dark_ocean",
    label: "Dark Ocean",
    description: "Deep sea blue with cyan highlights — calm and premium.",
    colors: {
      backgroundColor: "#0C4A6E",
      textColor: "#BAE6FD",
      buttonColor: "#22D3EE",
      buttonTextColor: "#0C4A6E",
    },
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Pure black and white — timeless and versatile.",
    colors: {
      backgroundColor: "#FFFFFF",
      textColor: "#18181B",
      buttonColor: "#18181B",
      buttonTextColor: "#FFFFFF",
    },
  },
];

export const DEFAULT_DESIGN_PRESET: DesignPresetId = "custom";

const PRESET_BY_ID = new Map(DESIGN_PRESETS.map((preset) => [preset.id, preset]));

export function getDesignPreset(id: DesignPresetId): DesignPreset {
  return PRESET_BY_ID.get(id) ?? PRESET_BY_ID.get("custom")!;
}

export function getDesignPresetOptions() {
  return DESIGN_PRESETS.map((preset) => ({
    label: preset.label,
    value: preset.id,
  }));
}

function normalizeHex(value: string): string {
  return value.trim().toLowerCase();
}

export function colorsMatchPreset(
  colors: DesignPresetColors,
  preset: DesignPreset,
): boolean {
  return (
    normalizeHex(colors.backgroundColor) === normalizeHex(preset.colors.backgroundColor) &&
    normalizeHex(colors.textColor) === normalizeHex(preset.colors.textColor) &&
    normalizeHex(colors.buttonColor) === normalizeHex(preset.colors.buttonColor) &&
    normalizeHex(colors.buttonTextColor) === normalizeHex(preset.colors.buttonTextColor)
  );
}

export function detectDesignPreset(colors: DesignPresetColors): DesignPresetId {
  for (const preset of DESIGN_PRESETS) {
    if (preset.id === "custom") continue;
    if (colorsMatchPreset(colors, preset)) {
      return preset.id;
    }
  }
  return "custom";
}
