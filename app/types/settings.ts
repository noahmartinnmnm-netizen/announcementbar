export type BarPosition = "top" | "bottom";

export type BarDisplayLocation = "global" | "cart_page" | "cart_drawer";

export type AnnouncementType = "simple" | "running" | "rotating";

export type RunningTextAlign = "left" | "right";

export type RotateNavPlacement = "content" | "edges";

export type CtaType = "button" | "link" | "none";

export type ScheduleStartMode = "now" | "date";

export type ScheduleEndMode = "never" | "date";

export type DesignPresetId =
  | "custom"
  | "dawn"
  | "electric"
  | "forest"
  | "grey"
  | "vibrant"
  | "neon"
  | "vanilla"
  | "love"
  | "earth"
  | "valentine"
  | "bubble_gum"
  | "black_yellow"
  | "sophisticated"
  | "fire"
  | "frost"
  | "sunny_evening"
  | "red_moon"
  | "dark_ocean"
  | "minimal";

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
  designPreset: DesignPresetId;
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
  onboarding?: OnboardingState;
}

export interface OnboardingState {
  completed: boolean;
  completedAt: string | null;
  skipped: boolean;
  embedConfirmed: boolean;
  preferredLocation: BarDisplayLocation | null;
}

export interface BarStats {
  total: number;
  active: number;
  disabled: number;
}

export type AnnouncementBarInput = Omit<AnnouncementBar, "id">;

export interface BarFormValues {
  name: string;
  title: string;
  message: string;
  subheading: string;
  couponCode: string;
  iconUrl: string;
  announcementType: AnnouncementType;
  runningTextAlign: RunningTextAlign;
  ctaType: CtaType;
  ctaText: string;
  ctaUrl: string;
  designPreset: DesignPresetId;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  fontSize: string;
  height: string;
  padding: string;
  borderRadius: string;
  customCss: string;
  customHtmlJavascript: string;
  sticky: boolean;
  dismissible: boolean;
  pauseOnHover: boolean;
  enabled: boolean;
  displayLocation: BarDisplayLocation;
  position: BarPosition;
  rotateInterval: string;
  runningSpeed: string;
  rotateNavPlacement: RotateNavPlacement;
  scheduleStartMode: ScheduleStartMode;
  scheduleEndMode: ScheduleEndMode;
  startDate: string;
  endDate: string;
  devices: DeviceTargeting;
  pages: PageTargeting;
  messages: AnnouncementMessage[];
}

export interface BarFormErrors {
  name?: string;
  title?: string;
  message?: string;
  subheading?: string;
  couponCode?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  fontSize?: string;
  height?: string;
  padding?: string;
  borderRadius?: string;
  rotateInterval?: string;
  runningSpeed?: string;
  startDate?: string;
  endDate?: string;
}

export const DEFAULT_DEVICE_TARGETING: DeviceTargeting = {
  desktop: true,
  mobile: true,
  tablet: true,
};

export const DEFAULT_PAGE_TARGETING: PageTargeting = {
  all: true,
  home: true,
  product: true,
  collection: true,
  cart: true,
  search: true,
  blog: true,
};
