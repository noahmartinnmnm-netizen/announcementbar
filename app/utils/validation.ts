import type { BarFormErrors, BarFormValues } from "../types";
import { MAX_RUNNING_SPEED } from "./bar";

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const NUMERIC_LIMITS = {
  fontSize: { min: 10, max: 72, label: "Font size" },
  height: { min: 32, max: 200, label: "Height" },
  padding: { min: 0, max: 64, label: "Padding" },
  borderRadius: { min: 0, max: 32, label: "Border radius" },
  rotateInterval: { min: 2, max: 60, label: "Rotate interval" },
  runningSpeed: { min: 20, max: MAX_RUNNING_SPEED, label: "Scroll speed" },
} as const;

function isValidUrl(url: string): boolean {
  if (!url.trim()) {
    return true;
  }

  if (url.startsWith("/")) {
    return true;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidHexColor(color: string): boolean {
  return HEX_COLOR_REGEX.test(color.trim());
}

function validateNumericField(
  value: string,
  key: keyof typeof NUMERIC_LIMITS,
): string | undefined {
  const { min, max, label } = NUMERIC_LIMITS[key];
  const trimmed = value.trim();

  if (!trimmed) {
    return `${label} is required.`;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    return `${label} must be a valid number.`;
  }

  if (parsed < min || parsed > max) {
    return `${label} must be between ${min} and ${max}.`;
  }

  return undefined;
}

function isValidDate(value: string): boolean {
  if (!value.trim()) {
    return false;
  }

  return Number.isFinite(Date.parse(value));
}

export function validateBarForm(values: BarFormValues): BarFormErrors {
  const errors: BarFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Announcement name is required.";
  }

  if (!values.message.trim() && values.announcementType !== "rotating") {
    errors.message = "Title is required.";
  }

  if (values.announcementType === "rotating") {
    const validMessages = values.messages.filter((item) => item.message.trim());
    if (validMessages.length < 2) {
      errors.message = "Add at least two announcements for rotating mode.";
    }
  }

  if (values.ctaType !== "none" && values.ctaUrl.trim() && !isValidUrl(values.ctaUrl)) {
    errors.ctaUrl = "Enter a valid URL (https://...) or a relative path (/pages/sale).";
  }

  if (values.ctaType !== "none" && values.ctaUrl.trim() && !values.ctaText.trim()) {
    errors.ctaText = "Button text is required when a link is provided.";
  }

  for (const colorField of [
    "backgroundColor",
    "textColor",
    "buttonColor",
    "buttonTextColor",
  ] as const) {
    const color = values[colorField].trim();
    if (!color) {
      errors[colorField] = "Color is required.";
    } else if (!isValidHexColor(color)) {
      errors[colorField] = "Enter a valid hex color (e.g. #111827).";
    }
  }

  for (const numericField of Object.keys(NUMERIC_LIMITS) as Array<
    keyof typeof NUMERIC_LIMITS
  >) {
    if (numericField === "rotateInterval" && values.announcementType !== "rotating") {
      continue;
    }
    if (numericField === "runningSpeed" && values.announcementType !== "running") {
      continue;
    }
    const message = validateNumericField(values[numericField], numericField);
    if (message) {
      errors[numericField] = message;
    }
  }

  if (values.scheduleStartMode === "date" && !isValidDate(values.startDate)) {
    errors.startDate = "Select a valid start date.";
  }

  if (values.scheduleEndMode === "date" && !isValidDate(values.endDate)) {
    errors.endDate = "Select a valid end date.";
  }

  if (
    values.scheduleStartMode === "date" &&
    values.scheduleEndMode === "date" &&
    isValidDate(values.startDate) &&
    isValidDate(values.endDate) &&
    Date.parse(values.startDate) >= Date.parse(values.endDate)
  ) {
    errors.endDate = "End date must be after the start date.";
  }

  return errors;
}

export function hasFormErrors(errors: BarFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
