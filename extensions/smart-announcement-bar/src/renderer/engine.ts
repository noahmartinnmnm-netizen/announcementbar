import { loadSettings, readStorefrontContext } from "../config/loader";
import {
  findCartPageMountPoint,
  mountInlineBarStack,
  watchCartDrawer,
} from "../dom/cart-mount";
import {
  applyMeasuredBodyOffset,
  clearBodyOffsets,
  createStack,
} from "../dom/layout";
import {
  filterBarsForStorefront,
  groupBarsByDisplayLocation,
  groupBarsByPosition,
  hasStickyBars,
  stackHeight,
} from "../filters";
import type {
  AnnouncementBar,
  BarPosition,
  EngineOptions,
} from "../types";
import { getDeviceType, onDeviceChange } from "../utils/device";
import { pruneDismissed } from "../utils/storage";
import { renderBar } from "./bar";

interface ActiveRender {
  stacks: HTMLElement[];
  instances: Array<{ destroy: () => void }>;
  cartDrawerCleanup: (() => void) | null;
}

export class AnnouncementEngine {
  private renderState: ActiveRender | null = null;
  private unsubscribeDevice: (() => void) | null = null;

  constructor(
    private readonly root: HTMLElement,
    private readonly options: EngineOptions = {},
  ) {}

  mount(): void {
    this.render();
    this.unsubscribeDevice = onDeviceChange(() => this.render());
  }

  unmount(): void {
    this.unsubscribeDevice?.();
    this.unsubscribeDevice = null;
    this.clear();
  }

  private clear(): void {
    if (!this.renderState) {
      return;
    }

    for (const instance of this.renderState.instances) {
      instance.destroy();
    }

    for (const stack of this.renderState.stacks) {
      stack.remove();
    }

    this.renderState.cartDrawerCleanup?.();
    this.renderState = null;
    clearBodyOffsets();
    this.root.hidden = true;
  }

  render(): void {
    this.clear();

    const settings = loadSettings();
    pruneDismissed(new Set(settings.bars.map((bar) => bar.id)));

    const { pageType, template } = readStorefrontContext(this.root);
    const context = {
      root: this.root,
      pageType,
      template,
      device: getDeviceType(),
      now: Date.now(),
    };

    const visible = filterBarsForStorefront(
      settings.bars,
      context,
      this.options.transformBar,
    );

    if (visible.length === 0) {
      return;
    }

    const byLocation = groupBarsByDisplayLocation(visible);
    const stacks: HTMLElement[] = [];
    const instances: ActiveRender["instances"] = [];
    const rerender = () => this.render();
    const hasGlobalBars = byLocation.global.length > 0;

    this.root.hidden = !hasGlobalBars;
    this.root.replaceChildren();

    const globalGrouped = groupBarsByPosition(byLocation.global);
    this.mountStack("top", globalGrouped.top, stacks, instances, rerender);
    this.mountStack("bottom", globalGrouped.bottom, stacks, instances, rerender);

    if (pageType === "cart" && byLocation.cart_page.length > 0) {
      const cartPageTarget = findCartPageMountPoint();
      if (cartPageTarget) {
        const mounted = mountInlineBarStack(
          cartPageTarget,
          byLocation.cart_page,
          "smart-announcement-stack--cart-page",
          rerender,
        );
        stacks.push(mounted.stack);
        instances.push(...mounted.instances);
      }
    }

    const cartDrawerCleanup = watchCartDrawer(byLocation.cart_drawer, rerender);

    this.renderState = { stacks, instances, cartDrawerCleanup };
  }

  private mountStack(
    position: BarPosition,
    bars: AnnouncementBar[],
    stacks: HTMLElement[],
    instances: ActiveRender["instances"],
    onDismiss: () => void,
  ): void {
    if (bars.length === 0) {
      return;
    }

    const sticky = hasStickyBars(bars);
    const stack = createStack(position, sticky);

    for (const bar of bars) {
      const rendered = renderBar(bar, onDismiss);
      stack.appendChild(rendered.element);
      instances.push(rendered);
    }

    if (position === "top") {
      document.body.insertBefore(stack, document.body.firstChild);
    } else {
      document.body.appendChild(stack);
    }

    if (sticky) {
      applyMeasuredBodyOffset(position, stack, stackHeight(bars));
    }

    stacks.push(stack);
  }
}

export function createEngine(root: HTMLElement, options?: EngineOptions) {
  return new AnnouncementEngine(root, options);
}
