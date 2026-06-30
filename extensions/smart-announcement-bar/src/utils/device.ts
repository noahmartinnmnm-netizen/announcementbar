import type { DeviceType } from "../types";

const MOBILE_QUERY = "(max-width: 749px)";
const TABLET_QUERY = "(min-width: 750px) and (max-width: 1024px)";

export function getDeviceType(): DeviceType {
  if (typeof window.matchMedia !== "function") {
    return "desktop";
  }

  if (window.matchMedia(MOBILE_QUERY).matches) {
    return "mobile";
  }

  if (window.matchMedia(TABLET_QUERY).matches) {
    return "tablet";
  }

  return "desktop";
}

export function onDeviceChange(callback: () => void): () => void {
  if (typeof window.matchMedia !== "function") {
    return () => undefined;
  }

  const mobile = window.matchMedia(MOBILE_QUERY);
  const tablet = window.matchMedia(TABLET_QUERY);
  const handler = () => callback();

  mobile.addEventListener("change", handler);
  tablet.addEventListener("change", handler);

  return () => {
    mobile.removeEventListener("change", handler);
    tablet.removeEventListener("change", handler);
  };
}
