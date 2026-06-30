import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { getThemeEmbedActivationUrl } from "../utils/theme-embed";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const themeEditorUrl = getThemeEmbedActivationUrl(
    session.shop,
    process.env.SHOPIFY_API_KEY || "",
  );

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Opening theme editor</title>
  </head>
  <body>
    <p>Opening theme editor…</p>
    <script>
      window.location.replace(${JSON.stringify(themeEditorUrl)});
    </script>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
};

export default function ThemeEditorRedirectRoute() {
  return null;
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
