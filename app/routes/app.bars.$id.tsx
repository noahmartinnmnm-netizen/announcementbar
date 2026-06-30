import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useActionData, useLoaderData } from "react-router";
import { BlockStack, Page } from "@shopify/polaris";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AnnouncementBarForm, StorefrontSetupBanner } from "../components";
import { getBarById } from "../services/bars.service";
import { authenticate } from "../shopify.server";
import { barToFormValues } from "../utils/bar";
import { processBarFormSubmission } from "../utils/bar-form.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const bar = await getBarById(admin, params.id ?? "");

  if (!bar) {
    throw new Response("Announcement bar not found.", { status: 404 });
  }

  return {
    bar,
    values: barToFormValues(bar),
    errors: {},
    shop: session.shop,
  };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { admin, redirect } = await authenticate.admin(request);
  const barId = params.id ?? "";
  const result = await processBarFormSubmission(request, admin, barId);

  if (!result.ok) {
    return {
      values: result.values,
      errors: result.errors,
    };
  }

  return redirect(`/app/bars/${result.barId}`);
};

export default function EditBarRoute() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const values = actionData?.values ?? loaderData.values;
  const errors = actionData?.errors ?? loaderData.errors;

  return (
    <Page
      titleHidden
      backAction={{ content: "Announcement bars", url: "/app/bars" }}
    >
      <BlockStack gap="500">
        <StorefrontSetupBanner published={values.enabled} />
        <AnnouncementBarForm
          initialValues={values}
          errors={errors}
          barId={loaderData.bar.id}
        />
      </BlockStack>
    </Page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
