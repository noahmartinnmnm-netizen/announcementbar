import type { AnnouncementBar } from "../types";
import { createStack } from "./layout";
import { renderBar } from "../renderer/bar";

const CART_DRAWER_SELECTORS = [
  "cart-drawer",
  "#CartDrawer",
  "#cart-drawer",
  "#Cart-Drawer",
  ".cart-drawer",
  "dialog.cart-drawer",
  "[data-cart-drawer]",
  ".drawer--cart",
  "shopify-cart-drawer",
  ".mini-cart",
  "#sidebar-cart",
];

const CART_DRAWER_INNER_SELECTORS = [
  ".drawer__inner",
  ".cart-drawer__inner",
  ".cart-drawer__contents",
  ".drawer__content",
  ".cart-drawer__content",
  "[data-cart-drawer-inner]",
  ".mini-cart__content",
];

const CART_PAGE_SELECTORS = [
  "main#MainContent",
  "#main-cart-items",
  ".cart__contents",
  "form.cart",
  ".cart-page",
  "[data-cart-page]",
  "main.cart",
];

function queryFirst(selectors: string[]): HTMLElement | null {
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element instanceof HTMLElement) {
      return element;
    }
  }
  return null;
}

function findCartDrawerElement(): HTMLElement | null {
  return queryFirst(CART_DRAWER_SELECTORS);
}

function getCartDrawerMountPoint(drawer: HTMLElement): HTMLElement {
  for (const selector of CART_DRAWER_INNER_SELECTORS) {
    const element = drawer.querySelector(selector);
    if (element instanceof HTMLElement) {
      return element;
    }
  }

  return drawer;
}

export function findCartPageMountPoint(): HTMLElement | null {
  return queryFirst(CART_PAGE_SELECTORS);
}

export function mountInlineBarStack(
  container: HTMLElement,
  bars: AnnouncementBar[],
  className: string,
  onDismiss: () => void,
): { stack: HTMLElement; instances: Array<{ destroy: () => void }> } {
  const stack = createStack("top", false);
  stack.classList.add(className);
  const instances: Array<{ destroy: () => void }> = [];

  for (const bar of bars) {
    const rendered = renderBar(bar, onDismiss);
    stack.appendChild(rendered.element);
    instances.push(rendered);
  }

  container.insertBefore(stack, container.firstChild);
  return { stack, instances };
}

export function watchCartDrawer(
  bars: AnnouncementBar[],
  onDismiss: () => void,
): () => void {
  if (bars.length === 0) {
    return () => undefined;
  }

  let mountedStack: HTMLElement | null = null;
  let instances: Array<{ destroy: () => void }> = [];

  const clearMounted = () => {
    for (const instance of instances) {
      instance.destroy();
    }
    instances = [];
    mountedStack?.remove();
    mountedStack = null;
  };

  const syncDrawerBars = () => {
    const drawer = findCartDrawerElement();
    if (!drawer) {
      clearMounted();
      return;
    }

    const mountPoint = getCartDrawerMountPoint(drawer);
    if (mountedStack && mountedStack.isConnected && mountedStack.parentElement === mountPoint) {
      return;
    }

    clearMounted();
    const mounted = mountInlineBarStack(
      mountPoint,
      bars,
      "smart-announcement-stack--cart-drawer",
      onDismiss,
    );
    mountedStack = mounted.stack;
    instances = mounted.instances;
  };

  syncDrawerBars();

  const observer = new MutationObserver(syncDrawerBars);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "open", "aria-hidden", "aria-expanded", "style"],
    childList: true,
    subtree: true,
  });

  const resyncEvents = [
    "click",
    "cart:open",
    "cart-drawer:open",
    "cart:updated",
    "cart:refresh",
    "theme:cart:open",
    "drawer:opened",
  ] as const;

  for (const eventName of resyncEvents) {
    document.addEventListener(eventName, syncDrawerBars, true);
  }

  return () => {
    observer.disconnect();
    for (const eventName of resyncEvents) {
      document.removeEventListener(eventName, syncDrawerBars, true);
    }
    clearMounted();
  };
}
