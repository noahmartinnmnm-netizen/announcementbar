export type BarPosition = "top" | "bottom";

export type BarDisplayLocation = "global" | "cart_page" | "cart_drawer";

export type DeviceType = "desktop" | "mobile" | "tablet";

export type AnnouncementType = "simple" | "running" | "rotating";

export type RunningTextAlign = "left" | "right";

export type RotateNavPlacement = "content" | "edges";

export type CtaType = "button" | "link" | "none";

export type ScheduleStartMode = "now" | "date";

export type ScheduleEndMode = "never" | "date";

export interface AnnouncementMessage {
  message: string;
  couponCode?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface DeviceTargeting {
  desktop: boolean;
  mobile: boolean;
  tablet: boolean;
}

export interface PageTargeting {
  all: boolean;
  home: boolean;
  product: boolean;
  collection: boolean;
  cart: boolean;
  search: boolean;
  blog: boolean;
}

export interface AnnouncementBar {
  id: string;
  name: string;
  title: string;
  message: string;
  subheading: string;
  couponCode: string;
  iconUrl: string;
  announcementType: AnnouncementType;
  runningTextAlign: RunningTextAlign;
  runningSpeed: number;
  ctaType: CtaType;
  ctaText: string;
  ctaUrl: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  fontSize: number;
  height: number;
  padding: number;
  borderRadius: number;
  customCss: string;
  customHtmlJavascript: string;
  sticky: boolean;
  dismissible: boolean;
  pauseOnHover: boolean;
  enabled: boolean;
  displayLocation: BarDisplayLocation;
  position: BarPosition;
  messages: AnnouncementMessage[];
  rotateInterval: number;
  rotateNavPlacement: RotateNavPlacement;
  scheduleStartMode: ScheduleStartMode;
  scheduleEndMode: ScheduleEndMode;
  startDate: string | null;
  endDate: string | null;
  devices: DeviceTargeting;
  pages: PageTargeting;
}

export interface AppSettings {
  bars: AnnouncementBar[];
}

export interface StorefrontContext {
  pageType: string;
  template: string;
  device: DeviceType;
  now: number;
}

export interface RenderContext extends StorefrontContext {
  root: HTMLElement;
}

export interface BarInstance {
  bar: AnnouncementBar;
  element: HTMLElement;
  destroy: () => void;
}

export interface EngineOptions {
  /** Hook for future AI / translation / segmentation layers */
  transformBar?: (bar: AnnouncementBar, context: StorefrontContext) => AnnouncementBar | null;
}

export const DISMISS_STORAGE_KEY = "smart_announcement_dismissed_v1";

export const ROOT_ID = "smart-announcement-root";
export const SETTINGS_ID = "smart-announcement-settings";

export const DEFAULT_DEVICES: DeviceTargeting = {
  desktop: true,
  mobile: true,
  tablet: true,
};

export const DEFAULT_PAGES: PageTargeting = {
  all: true,
  home: true,
  product: true,
  collection: true,
  cart: true,
  search: true,
  blog: true,
};
