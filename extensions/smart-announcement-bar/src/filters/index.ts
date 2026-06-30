import type { AnnouncementBar, BarDisplayLocation, BarPosition, StorefrontContext } from "../types";
import { isBarDismissed } from "./dismiss";
import { isBarEligible } from "./eligibility";

function getDisplayLocation(bar: AnnouncementBar): BarDisplayLocation {
  return bar.displayLocation ?? "global";
}

export function filterBarsForStorefront(
  bars: AnnouncementBar[],
  context: StorefrontContext,
  transformBar?: (bar: AnnouncementBar, context: StorefrontContext) => AnnouncementBar | null,
): AnnouncementBar[] {
  const results: AnnouncementBar[] = [];

  for (const source of bars) {
    const bar = transformBar ? transformBar(source, context) : source;
    if (!bar) continue;
    if (!isBarEligible(bar, context)) continue;
    if (isBarDismissed(bar)) continue;
    results.push(bar);
  }

  return results;
}

export function groupBarsByDisplayLocation(bars: AnnouncementBar[]) {
  const global: AnnouncementBar[] = [];
  const cart_page: AnnouncementBar[] = [];
  const cart_drawer: AnnouncementBar[] = [];

  for (const bar of bars) {
    const location = getDisplayLocation(bar);
    if (location === "cart_page") {
      cart_page.push(bar);
    } else if (location === "cart_drawer") {
      cart_drawer.push(bar);
    } else {
      global.push(bar);
    }
  }

  return { global, cart_page, cart_drawer };
}

export function groupBarsByPosition(bars: AnnouncementBar[]) {
  const top: AnnouncementBar[] = [];
  const bottom: AnnouncementBar[] = [];

  for (const bar of bars) {
    if (bar.position === "bottom") {
      bottom.push(bar);
    } else {
      top.push(bar);
    }
  }

  return { top, bottom } satisfies Record<BarPosition, AnnouncementBar[]>;
}

export function stackHeight(bars: AnnouncementBar[]): number {
  return bars.reduce((total, bar) => total + bar.height + bar.padding * 2, 0);
}

export function hasStickyBars(bars: AnnouncementBar[]): boolean {
  return bars.some((bar) => bar.sticky);
}
