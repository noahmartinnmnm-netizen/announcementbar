import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useLoaderData } from "react-router";
import { Page } from "@shopify/polaris";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AnnouncementBarList } from "../components";
import {
  deleteBar,
  duplicateBar,
  listBars,
  toggleBarEnabled,
} from "../services/bars.service";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const bars = await listBars(admin);

  return { bars };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, redirect } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const barId = String(formData.get("barId") ?? "");

  if (!barId) {
    return { error: "Missing announcement bar id." };
  }

  switch (intent) {
    case "delete":
      await deleteBar(admin, barId);
      return redirect("/app/bars");
    case "duplicate": {
      const copy = await duplicateBar(admin, barId);
      return redirect(`/app/bars/${copy.id}`);
    }
    case "toggle":
      await toggleBarEnabled(admin, barId);
      return null;
    default:
      return { error: "Unsupported action." };
  }
};

export default function BarsIndexRoute() {
  const { bars } = useLoaderData<typeof loader>();

  return (
    <Page
      title="Announcement bars"
      primaryAction={{
        content: "Create announcement bar",
        url: "/app/bars/new",
      }}
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <AnnouncementBarList bars={bars} />
    </Page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
