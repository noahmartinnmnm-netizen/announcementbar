import type { AnnouncementBar } from "../types";

const CUSTOM_CSS_ATTR = "data-smart-announcement-custom-css";

function looksLikeHtml(code: string): boolean {
  return /<\s*[a-z][\s\S]*>/i.test(code);
}

function runCustomJavaScript(
  bar: AnnouncementBar,
  element: HTMLElement,
  code: string,
): void {
  try {
    const run = new Function("bar", "element", code);
    run(bar, element);
  } catch (error) {
    console.error("[Smart Announcement Bar] Custom JavaScript error:", error);
  }
}

function stripScriptWrapper(code: string): string {
  const trimmed = code.trim();
  const match = trimmed.match(/^<\s*script[^>]*>([\s\S]*?)<\s*\/\s*script\s*>$/i);
  return match ? match[1].trim() : trimmed;
}

function injectCustomHtml(
  bar: AnnouncementBar,
  root: HTMLElement,
  code: string,
): Array<() => void> {
  const cleanups: Array<() => void> = [];
  const container = document.createElement("div");
  container.className = "smart-announcement-bar__custom-code";
  container.innerHTML = code;

  const scripts = Array.from(container.querySelectorAll("script"));
  for (const oldScript of scripts) {
    const src = oldScript.getAttribute("src")?.trim();
    if (src) {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      root.appendChild(script);
      cleanups.push(() => script.remove());
    } else {
      const scriptCode = oldScript.textContent?.trim();
      if (scriptCode) {
        runCustomJavaScript(bar, root, scriptCode);
      }
    }
    oldScript.remove();
  }

  if (container.childNodes.length > 0) {
    root.appendChild(container);
    cleanups.push(() => container.remove());
  }

  return cleanups;
}

export function applyBarCustomCode(
  bar: AnnouncementBar,
  root: HTMLElement,
): () => void {
  const cleanups: Array<() => void> = [];

  const css = bar.customCss?.trim();
  if (css) {
    const style = document.createElement("style");
    style.setAttribute(CUSTOM_CSS_ATTR, bar.id);
    style.textContent = css;
    document.head.appendChild(style);
    cleanups.push(() => style.remove());
  }

  const htmlJavascript = bar.customHtmlJavascript?.trim();
  if (htmlJavascript) {
    const unwrapped = stripScriptWrapper(htmlJavascript);
    if (looksLikeHtml(unwrapped)) {
      cleanups.push(...injectCustomHtml(bar, root, htmlJavascript));
    } else {
      runCustomJavaScript(bar, root, unwrapped);
    }
  }

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}
