import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Link, Outlet, useLoaderData, useRouteError } from "react-router";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import adminStyles from "../styles/admin.css?url";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProviderWithPolaris } from "../components";
import { getSettings } from "../services/settings.service";
import { authenticate } from "../shopify.server";
import {
  isOnboardingComplete,
  isOnboardingExemptPath,
} from "../utils/onboarding";

export const links = () => [
  { rel: "stylesheet", href: polarisStyles },
  { rel: "stylesheet", href: adminStyles },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin, redirect } = await authenticate.admin(request);
  const settings = await getSettings(admin);
  const url = new URL(request.url);
  const pathname = url.pathname;
  const onboardingComplete = isOnboardingComplete(settings);

  if (!onboardingComplete && !isOnboardingExemptPath(pathname)) {
    throw redirect("/app/onboarding");
  }

  if (onboardingComplete && pathname === "/app/onboarding") {
    throw redirect("/app");
  }

  return { apiKey: process.env.SHOPIFY_API_KEY || "", shop: session.shop };
};

export default function AppLayout() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProviderWithPolaris apiKey={apiKey}>
      <s-app-nav>
        <Link to="/app">Dashboard</Link>
        <Link to="/app/bars">Announcement bars</Link>
      </s-app-nav>
      <div className="sab-app-shell">
        <Outlet />
      </div>
    </AppProviderWithPolaris>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
