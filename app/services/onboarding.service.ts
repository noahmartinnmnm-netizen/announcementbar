import type {
  AdminGraphQLClient,
  AppSettings,
  BarDisplayLocation,
  OnboardingState,
} from "../types";
import {
  getOnboardingState,
  markOnboardingComplete,
  updateOnboardingProgress,
} from "../utils/onboarding";
import { getSettings, updateSettings } from "./settings.service";

function withOnboarding(
  current: AppSettings,
  onboarding: OnboardingState,
): AppSettings {
  return {
    ...current,
    onboarding,
  };
}

export async function saveOnboardingProgress(
  admin: AdminGraphQLClient,
  patch: Partial<
    Pick<OnboardingState, "embedConfirmed" | "preferredLocation">
  >,
): Promise<OnboardingState> {
  const settings = await updateSettings(admin, (current) =>
    withOnboarding(
      current,
      updateOnboardingProgress(getOnboardingState(current), patch),
    ),
  );

  return getOnboardingState(settings);
}

export async function completeOnboarding(
  admin: AdminGraphQLClient,
  options: {
    skipped?: boolean;
    preferredLocation?: BarDisplayLocation | null;
    embedConfirmed?: boolean;
  } = {},
): Promise<OnboardingState> {
  const settings = await updateSettings(admin, (current) =>
    withOnboarding(
      current,
      markOnboardingComplete(getOnboardingState(current), options),
    ),
  );

  return getOnboardingState(settings);
}

export async function getOnboardingStatus(
  admin: AdminGraphQLClient,
): Promise<{
  onboarding: OnboardingState;
  hasBars: boolean;
}> {
  const settings = await getSettings(admin);

  return {
    onboarding: getOnboardingState(settings),
    hasBars: settings.bars.length > 0,
  };
}
