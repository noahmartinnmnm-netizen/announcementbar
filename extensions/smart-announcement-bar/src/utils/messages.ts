import type { AnnouncementBar, AnnouncementMessage } from "../types";
import { hashParts } from "../utils/hash";

export function getBarMessages(bar: AnnouncementBar): AnnouncementMessage[] {
  if (bar.messages.length > 0) {
    return bar.messages;
  }

  if (!bar.message.trim()) {
    return [];
  }

  return [
    {
      message: bar.message,
      couponCode: bar.couponCode || undefined,
      ctaText: bar.ctaType !== "none" ? bar.ctaText || undefined : undefined,
      ctaUrl: bar.ctaType !== "none" ? bar.ctaUrl || undefined : undefined,
    },
  ];
}

export function getBarContentHash(bar: AnnouncementBar): string {
  const messages = getBarMessages(bar);
  return hashParts([
    bar.id,
    bar.name,
    bar.message,
    bar.subheading,
    bar.couponCode,
    bar.announcementType,
    bar.ctaType,
    bar.backgroundColor,
    bar.textColor,
    bar.buttonColor,
    bar.buttonTextColor,
    String(bar.fontSize),
    String(bar.height),
    String(bar.padding),
    String(bar.borderRadius),
    String(bar.sticky),
    String(bar.dismissible),
    bar.position,
    ...messages.map(
      (item) =>
        `${item.message}|${item.couponCode ?? ""}|${item.ctaText ?? ""}|${item.ctaUrl ?? ""}`,
    ),
  ]);
}

export function getRotateIntervalMs(bar: AnnouncementBar): number {
  const seconds = bar.rotateInterval > 0 ? bar.rotateInterval : 5;
  return seconds * 1000;
}
