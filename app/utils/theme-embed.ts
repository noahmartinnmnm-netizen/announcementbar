/** Theme extension folder name (shopify.extension.toml `handle`). */
export const THEME_EXTENSION_HANDLE = "smart-announcement-bar";

/**
 * App embed block handle — the Liquid filename without `.liquid`.
 * @see https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/configuration#app-embed-block-deep-link-url
 */
export const THEME_APP_EMBED_BLOCK_HANDLE = "app-embed";

/** In-app route that opens the theme editor in a new tab without navigating the current page. */
export const THEME_EDITOR_REDIRECT_PATH = "/app/theme-editor";

export function getStoreHandle(shop: string): string {
  const shopDomain = shop.includes(".") ? shop : `${shop}.myshopify.com`;
  return shopDomain.replace(/\.myshopify\.com$/i, "");
}

export function getThemeEmbedActivationUrl(
  shop: string,
  apiKey: string,
): string {
  const storeHandle = getStoreHandle(shop);
  const activateAppId = `${apiKey}/${THEME_APP_EMBED_BLOCK_HANDLE}`;

  return `https://admin.shopify.com/store/${storeHandle}/themes/current/editor?context=apps&activateAppId=${activateAppId}`;
}

/** Opens the theme editor via an app redirect route so the embedded app page stays put. */
export function openThemeEmbedActivationUrl(): void {
  const params = new URLSearchParams(window.location.search);
  const search = params.toString();
  const path = search
    ? `${THEME_EDITOR_REDIRECT_PATH}?${search}`
    : THEME_EDITOR_REDIRECT_PATH;

  window.open(path, "_blank", "noopener,noreferrer");
}
