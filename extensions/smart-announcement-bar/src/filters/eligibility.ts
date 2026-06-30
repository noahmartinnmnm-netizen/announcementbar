import type { AnnouncementBar, StorefrontContext } from "../types";
import { getBarMessages } from "../utils/messages";

function getDisplayLocation(bar: AnnouncementBar): AnnouncementBar["displayLocation"] {
  return bar.displayLocation ?? "global";
}

function parseDate(value: string | null): number | null {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function isWithinSchedule(bar: AnnouncementBar, now: number): boolean {
  const start = parseDate(bar.startDate);
  const end = parseDate(bar.endDate);

  if (start !== null && now < start) {
    return false;
  }

  if (end !== null && now > end) {
    return false;
  }

  return true;
}

export function matchesDevice(
  bar: AnnouncementBar,
  context: StorefrontContext,
): boolean {
  return bar.devices[context.device];
}

const PAGE_TYPE_MAP: Record<string, keyof AnnouncementBar["pages"]> = {
  index: "home",
  product: "product",
  collection: "collection",
  cart: "cart",
  search: "search",
  blog: "blog",
  article: "blog",
};

export function matchesPage(
  bar: AnnouncementBar,
  context: StorefrontContext,
): boolean {
  const location = getDisplayLocation(bar);

  if (location === "cart_page") {
    return context.pageType === "cart";
  }

  if (location === "cart_drawer") {
    return true;
  }

  if (bar.pages.all) {
    return true;
  }

  const key = PAGE_TYPE_MAP[context.pageType];
  if (!key) {
    return false;
  }

  return bar.pages[key];
}

export function isBarEligible(
  bar: AnnouncementBar,
  context: StorefrontContext,
): boolean {
  if (!bar.enabled) {
    return false;
  }

  if (!isWithinSchedule(bar, context.now)) {
    return false;
  }

  if (!matchesDevice(bar, context)) {
    return false;
  }

  if (!matchesPage(bar, context)) {
    return false;
  }

  return getBarMessages(bar).length > 0;
}
