import type {
  AppSettings,
  BarDisplayLocation,
  OnboardingState,
} from "../types";

export const DEFAULT_ONBOARDING: OnboardingState = {
  completed: false,
  completedAt: null,
  skipped: false,
  embedConfirmed: false,
  preferredLocation: null,
};

export function normalizeOnboarding(value: unknown): OnboardingState {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_ONBOARDING };
  }

  const record = value as Partial<OnboardingState>;
  const preferredLocation =
    record.preferredLocation === "cart_page" ||
    record.preferredLocation === "cart_drawer" ||
    record.preferredLocation === "global"
      ? record.preferredLocation
      : null;

  return {
    completed: record.completed === true,
    completedAt:
      typeof record.completedAt === "string" ? record.completedAt : null,
    skipped: record.skipped === true,
    embedConfirmed: record.embedConfirmed === true,
    preferredLocation,
  };
}

export function isOnboardingComplete(settings: AppSettings): boolean {
  if (settings.bars.length > 0) {
    return true;
  }

  return settings.onboarding?.completed === true;
}

export function getOnboardingState(settings: AppSettings): OnboardingState {
  return settings.onboarding ?? { ...DEFAULT_ONBOARDING };
}

export function markOnboardingComplete(
  current: OnboardingState | undefined,
  options: {
    skipped?: boolean;
    preferredLocation?: BarDisplayLocation | null;
    embedConfirmed?: boolean;
  } = {},
): OnboardingState {
  const base = current ?? { ...DEFAULT_ONBOARDING };

  return {
    ...base,
    completed: true,
    completedAt: new Date().toISOString(),
    skipped: options.skipped ?? base.skipped,
    embedConfirmed: options.embedConfirmed ?? base.embedConfirmed,
    preferredLocation:
      options.preferredLocation === undefined
        ? base.preferredLocation
        : options.preferredLocation,
  };
}

export function updateOnboardingProgress(
  current: OnboardingState | undefined,
  patch: Partial<
    Pick<OnboardingState, "embedConfirmed" | "preferredLocation">
  >,
): OnboardingState {
  const base = current ?? { ...DEFAULT_ONBOARDING };

  return {
    ...base,
    embedConfirmed:
      patch.embedConfirmed === undefined
        ? base.embedConfirmed
        : patch.embedConfirmed,
    preferredLocation:
      patch.preferredLocation === undefined
        ? base.preferredLocation
        : patch.preferredLocation,
  };
}

export function isOnboardingExemptPath(pathname: string): boolean {
  return (
    pathname === "/app/onboarding" || pathname.startsWith("/app/bars")
  );
}

export const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome",
    description: "See what Smart Announcement Bar can do for your store.",
  },
  {
    id: "embed",
    title: "Theme setup",
    description: "Turn on the app embed so shoppers can see your bars.",
  },
  {
    id: "placement",
    title: "Choose placement",
    description: "Pick where your first announcement should appear.",
  },
  {
    id: "create",
    title: "Create a bar",
    description: "Build your first announcement and publish it live.",
  },
  {
    id: "done",
    title: "All set",
    description: "Your workspace is ready. Head to the dashboard anytime.",
  },
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]["id"];
