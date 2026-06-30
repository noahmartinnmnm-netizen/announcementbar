import type { BarPosition } from "../types";

const BODY_PAD_CLASS: Record<BarPosition, string> = {
  top: "smart-announcement--pad-top",
  bottom: "smart-announcement--pad-bottom",
};

export function applyBodyOffset(position: BarPosition, height: number): void {
  const property = position === "top" ? "paddingTop" : "paddingBottom";
  document.body.style[property] = height > 0 ? `${height}px` : "";
  document.body.classList.toggle(BODY_PAD_CLASS[position], height > 0);
}

export function applyMeasuredBodyOffset(
  position: BarPosition,
  stack: HTMLElement,
  fallbackHeight = 0,
): void {
  const apply = () => {
    const measured = stack.offsetHeight;
    const height = measured > 0 ? measured : fallbackHeight;
    if (height > 0) {
      applyBodyOffset(position, height);
    }
  };

  apply();
  window.requestAnimationFrame(apply);
}

export function clearBodyOffsets(): void {
  document.body.style.paddingTop = "";
  document.body.style.paddingBottom = "";
  document.body.classList.remove(
    BODY_PAD_CLASS.top,
    BODY_PAD_CLASS.bottom,
  );
}

export function createStack(position: BarPosition, sticky: boolean): HTMLElement {
  const stack = document.createElement("div");
  stack.className = [
    "smart-announcement-stack",
    `smart-announcement-stack--${position}`,
    sticky ? `smart-announcement-stack--sticky-${position}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  stack.dataset.position = position;
  return stack;
}
