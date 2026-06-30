import type {
  AdminGraphQLClient,
  AnnouncementBar,
  AnnouncementBarInput,
} from "../types";
import {
  createBarId,
  duplicateBarInput,
} from "../utils/bar";
import { markOnboardingComplete } from "../utils/onboarding";
import { getSettings, updateSettings } from "./settings.service";

export async function listBars(
  admin: AdminGraphQLClient,
): Promise<AnnouncementBar[]> {
  const settings = await getSettings(admin);
  return settings.bars;
}

export async function getBarById(
  admin: AdminGraphQLClient,
  id: string,
): Promise<AnnouncementBar | null> {
  const settings = await getSettings(admin);
  return settings.bars.find((bar) => bar.id === id) ?? null;
}

export async function createBar(
  admin: AdminGraphQLClient,
  input: AnnouncementBarInput,
): Promise<AnnouncementBar> {
  const bar: AnnouncementBar = {
    ...input,
    id: createBarId(),
  };

  await updateSettings(admin, (current) => ({
    ...current,
    bars: [...current.bars, bar],
    onboarding: markOnboardingComplete(current.onboarding),
  }));

  return bar;
}

export async function updateBar(
  admin: AdminGraphQLClient,
  id: string,
  input: AnnouncementBarInput,
): Promise<AnnouncementBar> {
  let updatedBar: AnnouncementBar | null = null;

  await updateSettings(admin, (current) => {
    const bars = current.bars.map((bar) => {
      if (bar.id !== id) {
        return bar;
      }

      updatedBar = { ...input, id };
      return updatedBar;
    });

    return {
      ...current,
      bars,
    };
  });

  if (!updatedBar) {
    throw new Error("Announcement bar not found.");
  }

  return updatedBar;
}

export async function deleteBar(
  admin: AdminGraphQLClient,
  id: string,
): Promise<void> {
  const settings = await getSettings(admin);
  const exists = settings.bars.some((bar) => bar.id === id);

  if (!exists) {
    throw new Error("Announcement bar not found.");
  }

  await updateSettings(admin, (current) => ({
    ...current,
    bars: current.bars.filter((bar) => bar.id !== id),
  }));
}

export async function duplicateBar(
  admin: AdminGraphQLClient,
  id: string,
): Promise<AnnouncementBar> {
  const source = await getBarById(admin, id);

  if (!source) {
    throw new Error("Announcement bar not found.");
  }

  return createBar(admin, duplicateBarInput(source));
}

export async function toggleBarEnabled(
  admin: AdminGraphQLClient,
  id: string,
): Promise<AnnouncementBar> {
  const source = await getBarById(admin, id);

  if (!source) {
    throw new Error("Announcement bar not found.");
  }

  return updateBar(admin, id, {
    ...source,
    enabled: !source.enabled,
  });
}
