import type { AnnouncementBar, AppSettings } from "../types";
import { SETTINGS_ID } from "../types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function readString(record: Record<string, unknown>, key: string, fallback = ""): string {
  return typeof record[key] === "string" ? (record[key] as string) : fallback;
}

function readBoolean(record: Record<string, unknown>, key: string, fallback: boolean): boolean {
  return typeof record[key] === "boolean" ? (record[key] as boolean) : fallback;
}

function readNumber(record: Record<string, unknown>, key: string, fallback: number): number {
  const value = record[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function readNullableString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  if (value === null || value === undefined || value === "") return null;
  return typeof value === "string" ? value : null;
}

function normalizeMessage(raw: unknown) {
  if (!isRecord(raw)) return null;
  const message = readString(raw, "message").trim();
  if (!message) return null;
  const ctaText = readString(raw, "ctaText").trim();
  const ctaUrl = readString(raw, "ctaUrl").trim();
  const couponCode = readString(raw, "couponCode").trim();
  return {
    message,
    couponCode: couponCode || undefined,
    ctaText: ctaText || undefined,
    ctaUrl: ctaUrl || undefined,
  };
}

function normalizeBar(raw: unknown): AnnouncementBar | null {
  if (!isRecord(raw) || typeof raw.id !== "string") return null;

  const message = readString(raw, "message");
  const ctaText = readString(raw, "ctaText");
  const ctaUrl = readString(raw, "ctaUrl");
  const couponCode = readString(raw, "couponCode");
  const parsedMessages = Array.isArray(raw.messages)
    ? raw.messages
        .map((item: unknown) => normalizeMessage(item))
        .filter(
          (item): item is NonNullable<ReturnType<typeof normalizeMessage>> =>
            item !== null,
        )
    : [];

  const devicesRaw = isRecord(raw.devices) ? raw.devices : {};
  const pagesRaw = isRecord(raw.pages) ? raw.pages : {};

  const startDate = readNullableString(raw, "startDate");
  const endDate = readNullableString(raw, "endDate");
  const legacyTitle = readString(raw, "title") || readString(raw, "name");

  const messages =
    parsedMessages.length > 0
      ? parsedMessages
      : message
        ? [
            {
              message,
              couponCode: couponCode || undefined,
              ctaText: ctaText || undefined,
              ctaUrl: ctaUrl || undefined,
            },
          ]
        : [];

  const announcementType = readString(raw, "announcementType");
  const runningTextAlign = readString(raw, "runningTextAlign");
  const ctaType = readString(raw, "ctaType");

  return {
    id: raw.id,
    name: readString(raw, "name") || legacyTitle,
    title: legacyTitle,
    message,
    subheading: readString(raw, "subheading"),
    couponCode: readString(raw, "couponCode"),
    iconUrl: readString(raw, "iconUrl"),
    announcementType:
      announcementType === "running" || announcementType === "rotating"
        ? announcementType
        : "simple",
    runningTextAlign: runningTextAlign === "left" ? "left" : "right",
    runningSpeed: readNumber(raw, "runningSpeed", 80),
    ctaType: ctaType === "button" || ctaType === "link" ? ctaType : "none",
    ctaText,
    ctaUrl,
    backgroundColor: readString(raw, "backgroundColor", "#ffffff"),
    textColor: readString(raw, "textColor", "#111827"),
    buttonColor: readString(raw, "buttonColor", "#111827"),
    buttonTextColor: readString(raw, "buttonTextColor", "#ffffff"),
    fontSize: readNumber(raw, "fontSize", 14),
    height: readNumber(raw, "height", 48),
    padding: readNumber(raw, "padding", 12),
    borderRadius: readNumber(raw, "borderRadius", 0),
    customCss: readString(raw, "customCss"),
    customHtmlJavascript: readString(raw, "customHtmlJavascript"),
    sticky: readBoolean(raw, "sticky", true),
    dismissible: readBoolean(raw, "dismissible", false),
    pauseOnHover: readBoolean(raw, "pauseOnHover", false),
    enabled: readBoolean(raw, "enabled", false),
    displayLocation:
      readString(raw, "displayLocation") === "cart_page" ||
      readString(raw, "displayLocation") === "cart_drawer"
        ? (readString(raw, "displayLocation") as "cart_page" | "cart_drawer")
        : "global",
    position: readString(raw, "position") === "bottom" ? "bottom" : "top",
    messages,
    rotateInterval: readNumber(raw, "rotateInterval", 5),
    rotateNavPlacement:
      readString(raw, "rotateNavPlacement") === "edges" ? "edges" : "content",
    scheduleStartMode:
      readString(raw, "scheduleStartMode") === "date" || startDate ? "date" : "now",
    scheduleEndMode:
      readString(raw, "scheduleEndMode") === "date" || endDate ? "date" : "never",
    startDate,
    endDate,
    devices: {
      desktop: readBoolean(devicesRaw, "desktop", true),
      mobile: readBoolean(devicesRaw, "mobile", true),
      tablet: readBoolean(devicesRaw, "tablet", true),
    },
    pages: {
      all: readBoolean(pagesRaw, "all", true),
      home: readBoolean(pagesRaw, "home", true),
      product: readBoolean(pagesRaw, "product", true),
      collection: readBoolean(pagesRaw, "collection", true),
      cart: readBoolean(pagesRaw, "cart", true),
      search: readBoolean(pagesRaw, "search", true),
      blog: readBoolean(pagesRaw, "blog", true),
    },
  };
}

export function loadSettings(): AppSettings {
  const node = document.getElementById(SETTINGS_ID);
  if (!node?.textContent?.trim()) {
    return { bars: [] };
  }

  try {
    const parsed = JSON.parse(node.textContent) as unknown;
    if (!isRecord(parsed) || !Array.isArray(parsed.bars)) {
      return { bars: [] };
    }

    const bars = parsed.bars
      .map((item: unknown) => normalizeBar(item))
      .filter((bar): bar is AnnouncementBar => bar !== null);

    return { bars };
  } catch {
    return { bars: [] };
  }
}

export function readStorefrontContext(root: HTMLElement) {
  return {
    pageType: root.dataset.pageType ?? "",
    template: root.dataset.template ?? "",
  };
}
