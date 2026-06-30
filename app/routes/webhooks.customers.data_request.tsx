import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // This app does not store customer PII on our servers. Configuration lives in
  // Shopify shop metafields; dismiss state is stored only in the shopper's browser.

  return new Response();
};
