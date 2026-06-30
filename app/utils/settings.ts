import type { AppSettings, BarStats, OnboardingState } from "../types";
import { normalizeBar } from "./bar";
import { DEFAULT_ONBOARDING, normalizeOnboarding } from "./onboarding";

export const DEFAULT_SETTINGS: AppSettings = {
  bars: [],
  onboarding: { ...DEFAULT_ONBOARDING },
};

export function parseSettings(value: unknown): AppSettings {
  if (!value || typeof value !== "object") {
    return DEFAULT_SETTINGS;
  }

  const candidate = value as Partial<AppSettings>;
  if (!Array.isArray(candidate.bars)) {
    return {
      bars: [],
      onboarding: normalizeOnboarding(candidate.onboarding),
    };
  }

  const bars = candidate.bars
    .map((bar) => normalizeBar(bar))
    .filter((bar): bar is NonNullable<typeof bar> => bar !== null);

  return {
    bars,
    onboarding: normalizeOnboarding(candidate.onboarding),
  };
}

export function getBarStats(settings: AppSettings): BarStats {
  const total = settings.bars.length;
  const active = settings.bars.filter((bar) => bar.enabled).length;

  return {
    total,
    active,
    disabled: total - active,
  };
}
