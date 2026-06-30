import type { AnnouncementBar, AnnouncementMessage } from "../types";
import {
  getBarContentHash,
  getBarMessages,
  getRotateIntervalMs,
} from "../utils/messages";
import { saveDismissed } from "../utils/storage";
import { applyBarCustomCode } from "./custom-code";

function createMessageElement(
  message: AnnouncementMessage,
  visible: boolean,
): HTMLElement {
  const wrapper = document.createElement("span");
  wrapper.className = "smart-announcement-bar__message smart-announcement-bar__title";
  wrapper.setAttribute("role", "status");
  wrapper.textContent = message.message;
  if (!visible) {
    wrapper.setAttribute("aria-hidden", "true");
  }
  return wrapper;
}

const ROTATE_ANIM_MS = 260;

type SlideDirection = "next" | "prev";

function createCta(message: AnnouncementMessage, bar: AnnouncementBar): HTMLElement | null {
  if (bar.ctaType === "none" || !message.ctaText?.trim()) return null;

  const cta = document.createElement("a");
  cta.className =
    bar.ctaType === "link"
      ? "smart-announcement-bar__cta smart-announcement-bar__cta--link"
      : "smart-announcement-bar__cta";
  cta.textContent = message.ctaText;

  if (bar.ctaType === "button") {
    cta.style.backgroundColor = bar.buttonColor;
    cta.style.color = bar.buttonTextColor || bar.backgroundColor;
  } else {
    cta.style.color = bar.textColor;
  }

  if (message.ctaUrl?.trim()) {
    cta.href = message.ctaUrl;
  } else {
    cta.href = "#";
    cta.setAttribute("aria-disabled", "true");
    cta.addEventListener("click", (event) => event.preventDefault());
  }

  return cta;
}

function createSubheading(bar: AnnouncementBar): HTMLElement | null {
  if (!bar.subheading.trim()) return null;

  const subheading = document.createElement("span");
  subheading.className = "smart-announcement-bar__subheading";
  subheading.textContent = bar.subheading;
  return subheading;
}

function createCopyIcon(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");

  const back = document.createElementNS("http://www.w3.org/2000/svg", "path");
  back.setAttribute(
    "d",
    "M12.5 2a1.5 1.5 0 0 0-1.5 1.5v.5h-2A1.5 1.5 0 0 0 7.5 5.5v10A1.5 1.5 0 0 0 9 17h6.5a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 15.5 4H14v-.5A1.5 1.5 0 0 0 12.5 2Z",
  );

  const front = document.createElementNS("http://www.w3.org/2000/svg", "path");
  front.setAttribute(
    "d",
    "M6 4.5A1.5 1.5 0 0 0 4.5 6v10A1.5 1.5 0 0 0 6 17.5h6.5",
  );
  front.setAttribute("fill", "none");
  front.setAttribute("stroke", "currentColor");
  front.setAttribute("stroke-width", "1.5");

  svg.appendChild(back);
  svg.appendChild(front);
  return svg;
}

function createCouponCode(couponCode: string): HTMLElement | null {
  if (!couponCode.trim()) return null;

  const wrapper = document.createElement("div");
  wrapper.className = "smart-announcement-bar__coupon-wrap";

  const codeBox = document.createElement("span");
  codeBox.className = "smart-announcement-bar__coupon-code";
  codeBox.textContent = couponCode;

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "smart-announcement-bar__coupon-copy";
  copyButton.setAttribute("aria-label", `Copy coupon code ${couponCode}`);
  copyButton.appendChild(createCopyIcon());

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      copyButton.setAttribute("data-copied", "true");
      window.setTimeout(() => copyButton.removeAttribute("data-copied"), 1500);
    } catch {
      // Clipboard unavailable — no-op
    }
  };

  copyButton.addEventListener("click", copyCode);
  wrapper.appendChild(codeBox);
  wrapper.appendChild(copyButton);
  return wrapper;
}

function getMessageCouponCode(
  message: AnnouncementMessage,
  bar: AnnouncementBar,
): string {
  return message.couponCode?.trim() || bar.couponCode.trim();
}

function buildRotatingSlide(
  message: AnnouncementMessage,
  bar: AnnouncementBar,
): HTMLElement {
  const slide = document.createElement("div");
  slide.className = "smart-announcement-bar__slide";

  const copy = document.createElement("div");
  copy.className = "smart-announcement-bar__copy";

  const titles = document.createElement("div");
  titles.className = "smart-announcement-bar__titles";

  const messageEl = document.createElement("span");
  messageEl.className = "smart-announcement-bar__message smart-announcement-bar__title";
  messageEl.setAttribute("role", "status");
  messageEl.textContent = message.message;
  titles.appendChild(messageEl);
  copy.appendChild(titles);
  slide.appendChild(copy);

  const coupon = createCouponCode(getMessageCouponCode(message, bar));
  const cta = createCta(message, bar);

  if (coupon || cta) {
    const actions = document.createElement("div");
    actions.className = "smart-announcement-bar__actions";
    if (coupon) {
      actions.appendChild(coupon);
    }
    if (cta) {
      actions.appendChild(cta);
    }
    slide.appendChild(actions);
  }

  return slide;
}

function showRotatingSlide(
  viewport: HTMLElement,
  message: AnnouncementMessage,
  bar: AnnouncementBar,
  direction: SlideDirection,
): void {
  const slide = buildRotatingSlide(message, bar);
  slide.classList.add(
    direction === "next"
      ? "smart-announcement-bar__slide--in-right"
      : "smart-announcement-bar__slide--in-left",
  );
  viewport.replaceChildren(slide);

  const cleanup = () => {
    slide.classList.remove(
      "smart-announcement-bar__slide--in-right",
      "smart-announcement-bar__slide--in-left",
    );
  };

  slide.addEventListener("animationend", cleanup, { once: true });
  window.setTimeout(cleanup, ROTATE_ANIM_MS + 50);
}

function createRunningMarqueeSegment(
  bar: AnnouncementBar,
  message: string,
  hidden: boolean,
): HTMLElement {
  const segment = document.createElement("div");
  segment.className = "smart-announcement-bar__marquee-segment";
  if (hidden) {
    segment.setAttribute("aria-hidden", "true");
  }

  const title = document.createElement("span");
  title.className = "smart-announcement-bar__title";
  title.textContent = message;
  segment.appendChild(title);

  if (bar.subheading.trim()) {
    const subheading = document.createElement("span");
    subheading.className = "smart-announcement-bar__subheading";
    subheading.textContent = bar.subheading;
    segment.appendChild(subheading);
  }

  return segment;
}

function createRunningMarqueeSpacer(hidden: boolean): HTMLElement {
  const spacer = document.createElement("span");
  spacer.className = "smart-announcement-bar__marquee-spacer";
  spacer.setAttribute("aria-hidden", "true");
  if (hidden) {
    spacer.dataset.duplicate = "true";
  }
  return spacer;
}

function createRunningMarqueeUnit(
  bar: AnnouncementBar,
  message: string,
  hidden: boolean,
): HTMLElement {
  const unit = document.createElement("div");
  unit.className = "smart-announcement-bar__marquee-unit";
  if (hidden) {
    unit.setAttribute("aria-hidden", "true");
  }

  unit.appendChild(createRunningMarqueeSegment(bar, message, hidden));
  unit.appendChild(createRunningMarqueeSpacer(hidden));
  return unit;
}

const DEFAULT_RUNNING_SPEED = 80;

function resolveRunningSpeed(speed: number | undefined): number {
  return typeof speed === "number" && speed > 0 ? speed : DEFAULT_RUNNING_SPEED;
}

function measureMarqueeLoopWidth(marquee: HTMLElement): number {
  return marquee.scrollWidth / 2;
}

function rebuildRunningMarqueeLoop(
  marquee: HTMLElement,
  bar: AnnouncementBar,
  message: string,
  trackWidth: number,
): number {
  marquee.replaceChildren();
  marquee.appendChild(createRunningMarqueeUnit(bar, message, false));

  while (marquee.scrollWidth < trackWidth * 2) {
    marquee.appendChild(createRunningMarqueeUnit(bar, message, true));
  }

  const firstHalf = Array.from(marquee.children);
  for (const unit of firstHalf) {
    marquee.appendChild(unit.cloneNode(true));
  }

  return measureMarqueeLoopWidth(marquee);
}

function applyMarqueeAnimation(
  marquee: HTMLElement,
  loopWidth: number,
  runningTextAlign: AnnouncementBar["runningTextAlign"],
  speedPxPerSec: number,
): void {
  if (loopWidth <= 0) {
    return;
  }

  const speed = resolveRunningSpeed(speedPxPerSec);
  const duration = `${loopWidth / speed}s`;
  const previousDuration = marquee.style.getPropertyValue(
    "--smart-announcement-marquee-duration",
  );
  const animatedClass =
    runningTextAlign === "left"
      ? "smart-announcement-bar__marquee--animated-left"
      : "smart-announcement-bar__marquee--animated";

  marquee.style.setProperty("--smart-announcement-marquee-duration", duration);

  marquee.classList.remove(
    "smart-announcement-bar__marquee--animated",
    "smart-announcement-bar__marquee--animated-left",
  );

  if (previousDuration !== duration) {
    void marquee.offsetWidth;
  }

  marquee.classList.add(animatedClass);
}

function syncRunningMarquee(
  root: HTMLElement,
  bar: AnnouncementBar,
  message: string,
  state: { trackWidth: number; message: string },
): void {
  const track = root.querySelector<HTMLElement>(".smart-announcement-bar__marquee-track");
  const marquee = root.querySelector<HTMLElement>(".smart-announcement-bar__marquee");
  if (!track || !marquee) return;

  const trackWidth = track.clientWidth;
  if (trackWidth <= 0) return;

  const needsRebuild =
    state.trackWidth !== trackWidth ||
    state.message !== message ||
    marquee.children.length === 0;

  if (needsRebuild) {
    rebuildRunningMarqueeLoop(marquee, bar, message, trackWidth);
    state.trackWidth = trackWidth;
    state.message = message;
  }

  applyMarqueeAnimation(
    marquee,
    measureMarqueeLoopWidth(marquee),
    bar.runningTextAlign,
    bar.runningSpeed,
  );
}

function setupRunningMarquee(
  root: HTMLElement,
  bar: AnnouncementBar,
  message: string,
): (() => void) | undefined {
  const inner = root.querySelector<HTMLElement>(".smart-announcement-bar__inner");
  if (!inner) return undefined;

  const state = {
    trackWidth: 0,
    message: "",
  };

  const scheduleSync = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        syncRunningMarquee(root, bar, message, state);
      });
    });
  };

  scheduleSync();

  if (document.fonts?.ready) {
    void document.fonts.ready.then(scheduleSync);
  }

  window.addEventListener("load", scheduleSync, { once: true });

  if (typeof ResizeObserver === "undefined") {
    window.addEventListener("resize", scheduleSync);
    return () => {
      window.removeEventListener("resize", scheduleSync);
    };
  }

  const observer = new ResizeObserver(scheduleSync);
  observer.observe(inner);

  const actionsRail = root.querySelector<HTMLElement>(
    ".smart-announcement-bar__actions-rail",
  );
  if (actionsRail) {
    observer.observe(actionsRail);
  }

  return () => {
    observer.disconnect();
  };
}

function createAnnouncementLayout(
  bar: AnnouncementBar,
  messages: AnnouncementMessage[],
  options: { running?: boolean; rotating?: boolean } = {},
): {
  layout: HTMLElement;
  titlesEl: HTMLElement;
  messageEl: HTMLElement | null;
  actionsEl: HTMLElement;
  rotatingSlideViewport: HTMLElement | null;
} {
  const layout = document.createElement("div");
  layout.className = "smart-announcement-bar__layout";

  const titlesContainer = document.createElement("div");
  titlesContainer.className = "smart-announcement-bar__titles";

  let messageEl: HTMLElement | null = null;
  let rotatingSlideViewport: HTMLElement | null = null;
  let titlesEl: HTMLElement = titlesContainer;

  if (options.rotating) {
    layout.classList.add("smart-announcement-bar__layout--rotating");

    rotatingSlideViewport = document.createElement("div");
    rotatingSlideViewport.className = "smart-announcement-bar__slide-viewport";
    rotatingSlideViewport.appendChild(
      buildRotatingSlide(messages[0] ?? { message: bar.message }, bar),
    );
    layout.appendChild(rotatingSlideViewport);
    titlesEl = rotatingSlideViewport;
  } else {
    messages
      .map((message, index) => createMessageElement(message, index === 0))
      .forEach((node) => titlesContainer.appendChild(node));
  }

  const actionsEl = document.createElement("div");
  actionsEl.className = "smart-announcement-bar__actions";

  if (!options.rotating) {
    const couponNode = createCouponCode(
      getMessageCouponCode(messages[0] ?? { message: bar.message }, bar),
    );
    if (couponNode) {
      actionsEl.appendChild(couponNode);
    }

    layout.appendChild(titlesContainer);

    const subheadingNode = createSubheading(bar);
    if (subheadingNode && !options.running) {
      layout.appendChild(subheadingNode);
    }

    layout.appendChild(actionsEl);
  }

  return { layout, titlesEl, messageEl, actionsEl, rotatingSlideViewport };
}

function createNavArrow(direction: "prev" | "next"): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className =
    direction === "prev"
      ? "smart-announcement-bar__nav smart-announcement-bar__nav--prev"
      : "smart-announcement-bar__nav smart-announcement-bar__nav--next";
  button.setAttribute(
    "aria-label",
    direction === "prev" ? "Previous announcement" : "Next announcement",
  );
  button.innerHTML =
    direction === "prev"
      ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  return button;
}

function createIcon(bar: AnnouncementBar): HTMLElement | null {
  if (!bar.iconUrl.trim()) return null;

  const icon = document.createElement("img");
  icon.className = "smart-announcement-bar__icon";
  icon.src = bar.iconUrl;
  icon.alt = "";
  icon.width = 18;
  icon.height = 18;
  icon.style.width = "18px";
  icon.style.height = "18px";
  icon.style.maxWidth = "18px";
  icon.style.maxHeight = "18px";
  icon.style.objectFit = "contain";
  return icon;
}

export interface RenderedBar {
  element: HTMLElement;
  destroy: () => void;
}

export function renderBar(
  bar: AnnouncementBar,
  onDismiss: (bar: AnnouncementBar) => void,
): RenderedBar {
  const messages = getBarMessages(bar);
  const runningMessage = messages[0]?.message ?? bar.message;
  let activeIndex = 0;
  let timer: number | undefined;
  let stopMarqueeSync: (() => void) | undefined;

  const root = document.createElement("section");
  root.className = "smart-announcement-bar";
  if (bar.announcementType === "running") {
    root.classList.add("smart-announcement-bar--running");
    root.classList.add(
      bar.runningTextAlign === "right"
        ? "smart-announcement-bar--running-right"
        : "smart-announcement-bar--running-left",
    );
  }
  if (bar.announcementType === "simple") {
    root.classList.add("smart-announcement-bar--simple");
  }
  if (bar.announcementType === "rotating") {
    root.classList.add("smart-announcement-bar--rotating");
    root.classList.add(
      bar.rotateNavPlacement === "edges"
        ? "smart-announcement-bar--nav-edges"
        : "smart-announcement-bar--nav-content",
    );
  }
  if (bar.dismissible) {
    root.classList.add("smart-announcement-bar--dismissible");
  }
  if (
    bar.pauseOnHover &&
    (bar.announcementType === "running" || bar.announcementType === "rotating")
  ) {
    root.classList.add("smart-announcement-bar--pause-on-hover");
  }
  root.dataset.barId = bar.id;
  root.setAttribute("role", "region");
  root.setAttribute("aria-label", bar.name || bar.title || "Announcement");
  root.style.backgroundColor = bar.backgroundColor;
  root.style.setProperty("--smart-announcement-bg", bar.backgroundColor);
  root.style.color = bar.textColor;
  root.style.fontSize = `${bar.fontSize}px`;
  root.style.minHeight = `${bar.height}px`;
  root.style.padding = `${bar.padding}px`;
  root.style.borderRadius = `${bar.borderRadius}px`;

  const inner = document.createElement("div");
  inner.className = "smart-announcement-bar__inner";

  let titlesEl: HTMLElement;
  let actionsEl: HTMLElement;
  let rotatingSlideViewport: HTMLElement | null = null;
  let prevButton: HTMLButtonElement | null = null;
  let nextButton: HTMLButtonElement | null = null;

  if (bar.announcementType === "running") {
    const iconNode = createIcon(bar);
    if (iconNode) {
      const iconOverlay = document.createElement("div");
      iconOverlay.className = "smart-announcement-bar__icon-overlay";
      iconOverlay.appendChild(iconNode);
      inner.appendChild(iconOverlay);
    }

    const track = document.createElement("div");
    track.className = "smart-announcement-bar__marquee-track";

    const stage = document.createElement("div");
    stage.className =
      bar.runningTextAlign === "right"
        ? "smart-announcement-bar__marquee-stage smart-announcement-bar__marquee-stage--right"
        : "smart-announcement-bar__marquee-stage smart-announcement-bar__marquee-stage--left";

    const marquee = document.createElement("div");
    marquee.className = "smart-announcement-bar__marquee";
    marquee.appendChild(createRunningMarqueeUnit(bar, runningMessage, false));
    stage.appendChild(marquee);
    track.appendChild(stage);
    inner.appendChild(track);

    const actionsRail = document.createElement("div");
    actionsRail.className = "smart-announcement-bar__actions-rail";

    actionsEl = document.createElement("div");
    actionsEl.className = "smart-announcement-bar__actions-overlay";

    const couponNode = createCouponCode(
      getMessageCouponCode(messages[0] ?? { message: bar.message }, bar),
    );
    if (couponNode) {
      actionsEl.appendChild(couponNode);
    }

    actionsRail.appendChild(actionsEl);
    inner.appendChild(actionsRail);
    titlesEl = track;
  } else {
    const content = document.createElement("div");
    content.className = "smart-announcement-bar__content";

    const iconNode = createIcon(bar);
    if (iconNode) {
      content.appendChild(iconNode);
    }

    const layoutResult = createAnnouncementLayout(bar, messages, {
      running: false,
      rotating: bar.announcementType === "rotating",
    });
    content.appendChild(layoutResult.layout);
    inner.appendChild(content);
    titlesEl = layoutResult.titlesEl;
    actionsEl = layoutResult.actionsEl;
    rotatingSlideViewport = layoutResult.rotatingSlideViewport;

    if (bar.announcementType === "rotating" && messages.length > 1) {
      prevButton = createNavArrow("prev");
      nextButton = createNavArrow("next");
      inner.insertBefore(prevButton, content);
      inner.appendChild(nextButton);
    }
  }

  let ctaNode =
    bar.announcementType === "rotating"
      ? null
      : createCta(messages[0] ?? { message: bar.message }, bar);
  let couponNode =
    bar.announcementType === "rotating"
      ? null
      : actionsEl.querySelector<HTMLElement>(".smart-announcement-bar__coupon-wrap");
  const closeButton = bar.dismissible
    ? (() => {
        const close = document.createElement("button");
        close.type = "button";
        close.className = "smart-announcement-bar__close";
        close.setAttribute("aria-label", "Dismiss announcement");
        close.textContent = "\u00d7";
        close.addEventListener("click", () => {
          saveDismissed(bar.id, getBarContentHash(bar));
          onDismiss(bar);
        });
        return close;
      })()
    : null;

  if (ctaNode) {
    actionsEl.appendChild(ctaNode);
  }

  if (closeButton) {
    if (bar.announcementType === "running") {
      const actionsRail = inner.querySelector<HTMLElement>(
        ".smart-announcement-bar__actions-rail",
      );
      (actionsRail ?? inner).appendChild(closeButton);
    } else {
      inner.appendChild(closeButton);
    }
  }

  root.appendChild(inner);

  const messageNodes =
    bar.announcementType === "running"
      ? []
      : Array.from(titlesEl.querySelectorAll(".smart-announcement-bar__message"));

  const updateVisibleMessage = (
    index: number,
    direction: SlideDirection = "next",
  ) => {
    activeIndex = index;
    const currentMessage = messages[index] ?? { message: bar.message };

    if (rotatingSlideViewport) {
      showRotatingSlide(rotatingSlideViewport, currentMessage, bar, direction);
      return;
    }

    messageNodes.forEach((node, nodeIndex) => {
      node.toggleAttribute("aria-hidden", nodeIndex !== index);
    });

    if (couponNode) {
      couponNode.remove();
      couponNode = null;
    }

    const nextCoupon = createCouponCode(getMessageCouponCode(currentMessage, bar));
    if (nextCoupon) {
      couponNode = nextCoupon;
      actionsEl.insertBefore(nextCoupon, actionsEl.firstChild);
    }

    if (ctaNode) {
      ctaNode.remove();
      ctaNode = null;
    }

    const nextCta = createCta(currentMessage, bar);
    if (nextCta) {
      ctaNode = nextCta;
      actionsEl.appendChild(nextCta);
    }
  };

  const startRotation = () => {
    if (bar.announcementType !== "rotating" || messages.length <= 1) return;

    const interval = getRotateIntervalMs(bar);
    timer = window.setInterval(() => {
      const nextIndex = (activeIndex + 1) % messages.length;
      updateVisibleMessage(nextIndex, "next");
    }, interval);
  };

  const stopRotation = () => {
    if (timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };

  const restartRotation = () => {
    stopRotation();
    startRotation();
  };

  const goToMessage = (index: number, direction: SlideDirection) => {
    const normalized =
      ((index % messages.length) + messages.length) % messages.length;
    if (normalized === activeIndex) return;
    updateVisibleMessage(normalized, direction);
    restartRotation();
  };

  if (prevButton && nextButton) {
    prevButton.addEventListener("click", () =>
      goToMessage(activeIndex - 1, "prev"),
    );
    nextButton.addEventListener("click", () =>
      goToMessage(activeIndex + 1, "next"),
    );
  }

  startRotation();

  if (bar.pauseOnHover && bar.announcementType === "rotating") {
    root.addEventListener("mouseenter", stopRotation);
    root.addEventListener("mouseleave", startRotation);
  }

  if (bar.announcementType === "running") {
    stopMarqueeSync = setupRunningMarquee(root, bar, runningMessage);
  }

  const cleanupCustomCode = applyBarCustomCode(bar, root);

  return {
    element: root,
    destroy: () => {
      if (bar.pauseOnHover && bar.announcementType === "rotating") {
        root.removeEventListener("mouseenter", stopRotation);
        root.removeEventListener("mouseleave", startRotation);
      }
      stopRotation();
      stopMarqueeSync?.();
      cleanupCustomCode();
    },
  };
}
