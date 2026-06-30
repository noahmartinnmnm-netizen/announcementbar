/// <reference types="@react-router/node" />
/// <reference types="vite/client" />
/// <reference types="@shopify/polaris-types" />

declare module "@shopify/polaris/build/esm/styles.css?url" {
  const href: string;
  export default href;
}

interface ImportMetaEnv {
  readonly SHOPIFY_API_KEY: string;
  readonly SHOPIFY_API_SECRET: string;
  readonly SHOPIFY_APP_URL: string;
  readonly SCOPES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "s-app-nav": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export {};

declare namespace NodeJS {
  interface ProcessEnv {
    SHOPIFY_API_KEY?: string;
    SHOPIFY_API_SECRET?: string;
    SHOPIFY_APP_URL?: string;
    SCOPES?: string;
    SHOP_CUSTOM_DOMAIN?: string;
    NODE_ENV?: string;
  }
}
