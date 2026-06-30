import type {
  AnnouncementBar,
  AnnouncementBarInput,
  AnnouncementMessage,
  AnnouncementType,
  BarDisplayLocation,
  BarFormValues,
  CtaType,
  DeviceTargeting,
  PageTargeting,
  ScheduleEndMode,
  ScheduleStartMode,
} from "../types";
import {
  DEFAULT_DEVICE_TARGETING as DEFAULT_DEVICES,
  DEFAULT_PAGE_TARGETING as DEFAULT_PAGES,
  type DesignPresetId,
  type RotateNavPlacement,
} from "../types/settings";
import {
  DEFAULT_DESIGN_PRESET,
  detectDesignPreset,
  getDesignPreset,
} from "./design-presets";

export const DEFAULT_RUNNING_SPEED = 80;
export const MAX_RUNNING_SPEED = 500;

export const DEFAULT_BAR_INPUT: AnnouncementBarInput = {
  name: "",
  title: "",
  message: "Enjoy a 20% discount on all our products!",
  subheading: "",
  couponCode: "",
  iconUrl: "",
  announcementType: "simple",
  runningTextAlign: "right",
  runningSpeed: DEFAULT_RUNNING_SPEED,
  ctaType: "none",
  ctaText: "Shop now!",
  ctaUrl: "",
  designPreset: DEFAULT_DESIGN_PRESET,
  backgroundColor: "#ffffff",
  textColor: "#111827",
  buttonColor: "#111827",
  buttonTextColor: "#ffffff",
  fontSize: 14,
  height: 48,
  padding: 12,
  borderRadius: 0,
  customCss: "",
  customHtmlJavascript: "",
  sticky: true,
  dismissible: false,
  pauseOnHover: false,
  enabled: false,
  displayLocation: "global",
  position: "top",
  messages: [],
  rotateInterval: 5,
  rotateNavPlacement: "content",
  scheduleStartMode: "now",
  scheduleEndMode: "never",
  startDate: null,
  endDate: null,
  devices: { ...DEFAULT_DEVICES },
  pages: { ...DEFAULT_PAGES },
};

export function createBarId(): string {
  return crypto.randomUUID();
}

export function createEmptyBarInput(
  displayLocation: BarDisplayLocation = "global",
): AnnouncementBarInput {
  const base: AnnouncementBarInput = {
    ...DEFAULT_BAR_INPUT,
    displayLocation,
    devices: { ...DEFAULT_DEVICES },
    pages: { ...DEFAULT_PAGES },
  };

  if (displayLocation === "cart_page") {
    return {
      ...base,
      sticky: false,
      position: "top",
      pages: {
        all: false,
        home: false,
        product: false,
        collection: false,
        cart: true,
        search: false,
        blog: false,
      },
    };
  }

  if (displayLocation === "cart_drawer") {
    return {
      ...base,
      sticky: false,
      position: "top",
      pages: {
        all: true,
        home: true,
        product: true,
        collection: true,
        cart: true,
        search: true,
        blog: true,
      },
    };
  }

  return base;
}

export function readDisplayLocation(value: string): BarDisplayLocation {
  if (value === "cart_page" || value === "cart_drawer") {
    return value;
  }
  return "global";
}

export function getDisplayLocationLabel(location: BarDisplayLocation): string {
  switch (location) {
    case "cart_page":
      return "Cart page";
    case "cart_drawer":
      return "Cart drawer";
    default:
      return "Top/Bottom bar";
  }
}

export function barToFormValues(bar: AnnouncementBarInput): BarFormValues {
  const messages =
    bar.messages.length > 0
      ? bar.messages
      : bar.message
        ? [
            {
              message: bar.message,
              couponCode: bar.couponCode || undefined,
              ctaText: bar.ctaText || undefined,
              ctaUrl: bar.ctaUrl || undefined,
            },
          ]
        : [];

  return {
    name: bar.name || bar.title,
    title: bar.title,
    message: bar.message,
    subheading: bar.subheading,
    couponCode: bar.couponCode,
    iconUrl: bar.iconUrl,
    announcementType: bar.announcementType,
    runningTextAlign: bar.runningTextAlign,
    runningSpeed: String(bar.runningSpeed),
    ctaType: bar.ctaType,
    ctaText: bar.ctaText,
    ctaUrl: bar.ctaUrl,
    designPreset:
      bar.designPreset ??
      detectDesignPreset({
        backgroundColor: bar.backgroundColor,
        textColor: bar.textColor,
        buttonColor: bar.buttonColor,
        buttonTextColor: bar.buttonTextColor,
      }),
    backgroundColor: bar.backgroundColor,
    textColor: bar.textColor,
    buttonColor: bar.buttonColor,
    buttonTextColor: bar.buttonTextColor,
    fontSize: String(bar.fontSize),
    height: String(bar.height),
    padding: String(bar.padding),
    borderRadius: String(bar.borderRadius),
    customCss: bar.customCss ?? "",
    customHtmlJavascript: bar.customHtmlJavascript ?? "",
    sticky: bar.sticky,
    dismissible: bar.dismissible,
    pauseOnHover: bar.pauseOnHover,
    enabled: bar.enabled,
    displayLocation: bar.displayLocation,
    position: bar.position,
    rotateInterval: String(bar.rotateInterval),
    rotateNavPlacement: bar.rotateNavPlacement ?? DEFAULT_BAR_INPUT.rotateNavPlacement,
    scheduleStartMode: bar.scheduleStartMode,
    scheduleEndMode: bar.scheduleEndMode,
    startDate: bar.startDate ?? "",
    endDate: bar.endDate ?? "",
    devices: { ...bar.devices },
    pages: { ...bar.pages },
    messages,
  };
}

function readAnnouncementType(value: string): AnnouncementType {
  if (value === "running" || value === "rotating") {
    return value;
  }
  return "simple";
}

function readRunningTextAlign(value: string): AnnouncementBar["runningTextAlign"] {
  return value === "left" ? "left" : "right";
}

function readCtaType(value: string): CtaType {
  if (value === "link" || value === "none") {
    return value;
  }
  return "button";
}

function readRotateNavPlacement(value: string): RotateNavPlacement {
  return value === "edges" ? "edges" : "content";
}

function readDesignPreset(value: string): DesignPresetId {
  const preset = getDesignPreset(value as DesignPresetId);
  return preset.id;
}

function readScheduleStartMode(value: string): ScheduleStartMode {
  return value === "date" ? "date" : "now";
}

function readScheduleEndMode(value: string): ScheduleEndMode {
  return value === "date" ? "date" : "never";
}

function readDevicesFromFormData(formData: FormData): DeviceTargeting {
  return {
    desktop: formData.get("deviceDesktop") === "true",
    mobile: formData.get("deviceMobile") === "true",
    tablet: formData.get("deviceTablet") === "true",
  };
}

function readPagesFromFormData(formData: FormData): PageTargeting {
  return {
    all: formData.get("pageAll") === "true",
    home: formData.get("pageHome") === "true",
    product: formData.get("pageProduct") === "true",
    collection: formData.get("pageCollection") === "true",
    cart: formData.get("pageCart") === "true",
    search: formData.get("pageSearch") === "true",
    blog: formData.get("pageBlog") === "true",
  };
}

function readMessagesFromFormData(formData: FormData): AnnouncementMessage[] {
  const raw = String(formData.get("messagesJson") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        message: String(item.message ?? ""),
        couponCode: item.couponCode ? String(item.couponCode) : undefined,
        ctaText: item.ctaText ? String(item.ctaText) : undefined,
        ctaUrl: item.ctaUrl ? String(item.ctaUrl) : undefined,
      }))
      .filter((item) => item.message.trim().length > 0);
  } catch {
    return [];
  }
}

export function parseBarFromFormData(formData: FormData): BarFormValues {
  return {
    name: String(formData.get("name") ?? ""),
    title: String(formData.get("title") ?? ""),
    message: String(formData.get("message") ?? ""),
    subheading: String(formData.get("subheading") ?? ""),
    couponCode: String(formData.get("couponCode") ?? ""),
    iconUrl: String(formData.get("iconUrl") ?? ""),
    announcementType: readAnnouncementType(String(formData.get("announcementType") ?? "")),
    runningTextAlign: readRunningTextAlign(String(formData.get("runningTextAlign") ?? "")),
    runningSpeed: String(formData.get("runningSpeed") ?? String(DEFAULT_RUNNING_SPEED)),
    ctaType: readCtaType(String(formData.get("ctaType") ?? "")),
    ctaText: String(formData.get("ctaText") ?? ""),
    ctaUrl: String(formData.get("ctaUrl") ?? ""),
    designPreset: readDesignPreset(String(formData.get("designPreset") ?? "")),
    backgroundColor: String(formData.get("backgroundColor") ?? ""),
    textColor: String(formData.get("textColor") ?? ""),
    buttonColor: String(formData.get("buttonColor") ?? ""),
    buttonTextColor: String(formData.get("buttonTextColor") ?? ""),
    fontSize: String(formData.get("fontSize") ?? ""),
    height: String(formData.get("height") ?? ""),
    padding: String(formData.get("padding") ?? ""),
    borderRadius: String(formData.get("borderRadius") ?? ""),
    customCss: String(formData.get("customCss") ?? ""),
    customHtmlJavascript: String(formData.get("customHtmlJavascript") ?? ""),
    sticky: formData.get("sticky") === "true",
    dismissible: formData.get("dismissible") === "true",
    pauseOnHover: formData.get("pauseOnHover") === "true",
    enabled: formData.get("enabled") === "true",
    displayLocation: readDisplayLocation(String(formData.get("displayLocation") ?? "")),
    position: String(formData.get("position") ?? "top") === "bottom" ? "bottom" : "top",
    rotateInterval: String(formData.get("rotateInterval") ?? "5"),
    rotateNavPlacement: readRotateNavPlacement(
      String(formData.get("rotateNavPlacement") ?? ""),
    ),
    scheduleStartMode: readScheduleStartMode(String(formData.get("scheduleStartMode") ?? "")),
    scheduleEndMode: readScheduleEndMode(String(formData.get("scheduleEndMode") ?? "")),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    devices: readDevicesFromFormData(formData),
    pages: readPagesFromFormData(formData),
    messages: readMessagesFromFormData(formData),
  };
}

export function formValuesToBarInput(values: BarFormValues): AnnouncementBarInput {
  const rotateInterval = Number(values.rotateInterval);
  const runningSpeed = Number(values.runningSpeed);
  const startDate =
    values.scheduleStartMode === "date" && values.startDate.trim()
      ? values.startDate.trim()
      : null;
  const endDate =
    values.scheduleEndMode === "date" && values.endDate.trim()
      ? values.endDate.trim()
      : null;

  let messages = values.messages
    .filter((item) => item.message.trim().length > 0)
    .map((item) => ({
      message: item.message.trim(),
      couponCode: item.couponCode?.trim() || undefined,
      ctaText: item.ctaText?.trim() || undefined,
      ctaUrl: item.ctaUrl?.trim() || undefined,
    }));

  if (values.announcementType === "rotating" && messages.length === 0 && values.message.trim()) {
    messages = [
      {
        message: values.message.trim(),
        couponCode: values.couponCode.trim() || undefined,
        ctaText: values.ctaText.trim() || undefined,
        ctaUrl: values.ctaUrl.trim() || undefined,
      },
    ];
  }

  const input: AnnouncementBarInput = {
    name: values.name.trim(),
    title: values.title.trim(),
    message: values.message.trim(),
    subheading: values.subheading.trim(),
    couponCode: values.couponCode.trim(),
    iconUrl: values.iconUrl.trim(),
    announcementType: values.announcementType,
    runningTextAlign: values.runningTextAlign,
    runningSpeed: Number.isFinite(runningSpeed) ? runningSpeed : DEFAULT_RUNNING_SPEED,
    ctaType: values.ctaType,
    ctaText: values.ctaText.trim(),
    ctaUrl: values.ctaUrl.trim(),
    designPreset: values.designPreset,
    backgroundColor: values.backgroundColor.trim(),
    textColor: values.textColor.trim(),
    buttonColor: values.buttonColor.trim(),
    buttonTextColor: values.buttonTextColor.trim(),
    fontSize: Number(values.fontSize),
    height: Number(values.height),
    padding: Number(values.padding),
    borderRadius: Number(values.borderRadius),
    customCss: values.customCss,
    customHtmlJavascript: values.customHtmlJavascript,
    sticky: values.sticky,
    dismissible: values.dismissible,
    pauseOnHover: values.pauseOnHover,
    enabled: values.enabled,
    displayLocation: values.displayLocation,
    position: values.position,
    messages,
    rotateInterval: Number.isFinite(rotateInterval) ? rotateInterval : DEFAULT_BAR_INPUT.rotateInterval,
    rotateNavPlacement: values.rotateNavPlacement,
    scheduleStartMode: values.scheduleStartMode,
    scheduleEndMode: values.scheduleEndMode,
    startDate,
    endDate,
    devices: { ...values.devices },
    pages: { ...values.pages },
  };

  if (input.announcementType !== "rotating" && input.message) {
    input.messages = [
      {
        message: input.message,
        couponCode: input.couponCode || undefined,
        ctaText: input.ctaType !== "none" ? input.ctaText || undefined : undefined,
        ctaUrl: input.ctaType !== "none" ? input.ctaUrl || undefined : undefined,
      },
    ];
  }

  return input;
}

export function duplicateBarInput(source: AnnouncementBar): AnnouncementBarInput {
  return {
    ...source,
    name: `${source.name || source.title} (Copy)`,
    enabled: false,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function readString(record: Record<string, unknown>, key: string, fallback = ""): string {
  const value = record[key];
  return typeof value === "string" ? value : fallback;
}

function readBoolean(
  record: Record<string, unknown>,
  key: string,
  fallback: boolean,
): boolean {
  const value = record[key];
  return typeof value === "boolean" ? value : fallback;
}

function readNumber(
  record: Record<string, unknown>,
  key: string,
  fallback: number,
): number {
  const value = record[key];
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function readNullableString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return typeof value === "string" ? value : null;
}

function readPosition(record: Record<string, unknown>): AnnouncementBar["position"] {
  const value = readString(record, "position", DEFAULT_BAR_INPUT.position);
  return value === "bottom" ? "bottom" : "top";
}

function readAnnouncementTypeFromRecord(
  record: Record<string, unknown>,
): AnnouncementType {
  const value = readString(record, "announcementType", DEFAULT_BAR_INPUT.announcementType);
  return readAnnouncementType(value);
}

function readRunningTextAlignFromRecord(
  record: Record<string, unknown>,
): AnnouncementBar["runningTextAlign"] {
  const value = readString(record, "runningTextAlign", DEFAULT_BAR_INPUT.runningTextAlign);
  return readRunningTextAlign(value);
}

function readCtaTypeFromRecord(record: Record<string, unknown>): CtaType {
  const value = readString(record, "ctaType", DEFAULT_BAR_INPUT.ctaType);
  return readCtaType(value);
}

function readMessages(record: Record<string, unknown>): AnnouncementMessage[] {
  const rawMessages = record.messages;
  if (!Array.isArray(rawMessages)) {
    return [];
  }

  return rawMessages
    .filter(isRecord)
    .map((item) => ({
      message: readString(item, "message"),
      couponCode: readString(item, "couponCode") || undefined,
      ctaText: readString(item, "ctaText") || undefined,
      ctaUrl: readString(item, "ctaUrl") || undefined,
    }))
    .filter((item) => item.message.trim().length > 0);
}

function readDevices(record: Record<string, unknown>): AnnouncementBar["devices"] {
  const raw = record.devices;
  if (!isRecord(raw)) {
    return { ...DEFAULT_DEVICES };
  }

  return {
    desktop: readBoolean(raw, "desktop", DEFAULT_DEVICES.desktop),
    mobile: readBoolean(raw, "mobile", DEFAULT_DEVICES.mobile),
    tablet: readBoolean(raw, "tablet", DEFAULT_DEVICES.tablet),
  };
}

function readPages(record: Record<string, unknown>): AnnouncementBar["pages"] {
  const raw = record.pages;
  if (!isRecord(raw)) {
    return { ...DEFAULT_PAGES };
  }

  return {
    all: readBoolean(raw, "all", DEFAULT_PAGES.all),
    home: readBoolean(raw, "home", DEFAULT_PAGES.home),
    product: readBoolean(raw, "product", DEFAULT_PAGES.product),
    collection: readBoolean(raw, "collection", DEFAULT_PAGES.collection),
    cart: readBoolean(raw, "cart", DEFAULT_PAGES.cart),
    search: readBoolean(raw, "search", DEFAULT_PAGES.search),
    blog: readBoolean(raw, "blog", DEFAULT_PAGES.blog),
  };
}

export function normalizeBar(raw: unknown): AnnouncementBar | null {
  if (!isRecord(raw) || typeof raw.id !== "string") {
    return null;
  }

  const legacyTitle = readString(raw, "title") || readString(raw, "name");
  const name = readString(raw, "name") || legacyTitle || DEFAULT_BAR_INPUT.name;
  const message = readString(raw, "message", DEFAULT_BAR_INPUT.message);
  const ctaText = readString(raw, "ctaText", DEFAULT_BAR_INPUT.ctaText);
  const ctaUrl = readString(raw, "ctaUrl", DEFAULT_BAR_INPUT.ctaUrl);
  const parsedMessages = readMessages(raw);

  const messages =
    parsedMessages.length > 0
      ? parsedMessages
      : message
        ? [
            {
              message,
              couponCode: readString(raw, "couponCode") || undefined,
              ctaText: ctaText || undefined,
              ctaUrl: ctaUrl || undefined,
            },
          ]
        : [];

  const startDate = readNullableString(raw, "startDate");
  const endDate = readNullableString(raw, "endDate");

  return {
    id: raw.id,
    name,
    title: legacyTitle,
    message,
    subheading: readString(raw, "subheading", DEFAULT_BAR_INPUT.subheading),
    couponCode: readString(raw, "couponCode", DEFAULT_BAR_INPUT.couponCode),
    iconUrl: readString(raw, "iconUrl", DEFAULT_BAR_INPUT.iconUrl),
    announcementType: readAnnouncementTypeFromRecord(raw),
    runningTextAlign: readRunningTextAlignFromRecord(raw),
    runningSpeed: readNumber(raw, "runningSpeed", DEFAULT_RUNNING_SPEED),
    ctaType: readCtaTypeFromRecord(raw),
    ctaText,
    ctaUrl,
    designPreset: readDesignPreset(
      readString(raw, "designPreset", DEFAULT_BAR_INPUT.designPreset),
    ),
    backgroundColor: readString(
      raw,
      "backgroundColor",
      DEFAULT_BAR_INPUT.backgroundColor,
    ),
    textColor: readString(raw, "textColor", DEFAULT_BAR_INPUT.textColor),
    buttonColor: readString(raw, "buttonColor", DEFAULT_BAR_INPUT.buttonColor),
    buttonTextColor: readString(
      raw,
      "buttonTextColor",
      DEFAULT_BAR_INPUT.buttonTextColor,
    ),
    fontSize: readNumber(raw, "fontSize", DEFAULT_BAR_INPUT.fontSize),
    height: readNumber(raw, "height", DEFAULT_BAR_INPUT.height),
    padding: readNumber(raw, "padding", DEFAULT_BAR_INPUT.padding),
    borderRadius: readNumber(raw, "borderRadius", DEFAULT_BAR_INPUT.borderRadius),
    customCss: readString(raw, "customCss", DEFAULT_BAR_INPUT.customCss),
    customHtmlJavascript: readString(
      raw,
      "customHtmlJavascript",
      DEFAULT_BAR_INPUT.customHtmlJavascript,
    ),
    sticky: readBoolean(raw, "sticky", DEFAULT_BAR_INPUT.sticky),
    dismissible: readBoolean(raw, "dismissible", DEFAULT_BAR_INPUT.dismissible),
    pauseOnHover: readBoolean(raw, "pauseOnHover", DEFAULT_BAR_INPUT.pauseOnHover),
    enabled: readBoolean(raw, "enabled", DEFAULT_BAR_INPUT.enabled),
    displayLocation: readDisplayLocation(readString(raw, "displayLocation", DEFAULT_BAR_INPUT.displayLocation)),
    position: readPosition(raw),
    messages,
    rotateInterval: readNumber(raw, "rotateInterval", DEFAULT_BAR_INPUT.rotateInterval),
    rotateNavPlacement: readRotateNavPlacement(
      readString(raw, "rotateNavPlacement", DEFAULT_BAR_INPUT.rotateNavPlacement),
    ),
    scheduleStartMode:
      readString(raw, "scheduleStartMode") === "date" ? "date" : startDate ? "date" : "now",
    scheduleEndMode:
      readString(raw, "scheduleEndMode") === "date" ? "date" : endDate ? "date" : "never",
    startDate,
    endDate,
    devices: readDevices(raw),
    pages: readPages(raw),
  };
}

export function getBarMessages(
  bar: AnnouncementBar | AnnouncementBarInput,
): AnnouncementMessage[] {
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

export function getBarDisplayName(bar: AnnouncementBar | AnnouncementBarInput): string {
  return bar.name.trim() || bar.title.trim() || "Untitled announcement";
}
