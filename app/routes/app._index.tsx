import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { Dashboard } from "../components";
import { getSettings } from "../services/settings.service";
import { authenticate } from "../shopify.server";
import { getBarStats } from "../utils/settings";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const settings = await getSettings(admin);

  return {
    stats: getBarStats(settings),
  };
};

export default function Index() {
  const { stats } = useLoaderData<typeof loader>();

  return <Dashboard stats={stats} />;
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
