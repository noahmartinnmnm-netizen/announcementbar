import { createEngine } from "./renderer/engine";
import { ROOT_ID } from "./types";

function scheduleInit(callback: () => void): void {
  const idle = (window as Window & { requestIdleCallback?: typeof requestIdleCallback })
    .requestIdleCallback;

  if (typeof idle === "function") {
    idle(callback, { timeout: 2000 });
    return;
  }

  window.setTimeout(callback, 1);
}

function bootstrap(): void {
  const root = document.getElementById(ROOT_ID);
  if (!root) {
    return;
  }

  const engine = createEngine(root, {
    // Extension point for future targeting layers (AI, geo, segments, A/B).
    transformBar: undefined,
  });

  engine.mount();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => scheduleInit(bootstrap), {
    once: true,
  });
} else {
  scheduleInit(bootstrap);
}
