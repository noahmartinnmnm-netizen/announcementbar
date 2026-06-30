import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useActionData, useLoaderData } from "react-router";
import { Page } from "@shopify/polaris";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AnnouncementBarForm, AnnouncementLocationPicker } from "../components";
import { authenticate } from "../shopify.server";
import { barToFormValues, createEmptyBarInput, readDisplayLocation } from "../utils/bar";
import { processBarFormSubmission } from "../utils/bar-form.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const url = new URL(request.url);
  const location = readDisplayLocation(url.searchParams.get("location") ?? "");

  if (!url.searchParams.get("location")) {
    return { step: "pick" as const, values: null, errors: {} };
  }

  return {
    step: "form" as const,
    location,
    values: barToFormValues(createEmptyBarInput(location)),
    errors: {},
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, redirect } = await authenticate.admin(request);
  const result = await processBarFormSubmission(request, admin);

  if (!result.ok) {
    return {
      step: "form" as const,
      values: result.values,
      errors: result.errors,
    };
  }

  return redirect(`/app/bars/${result.barId}`);
};

export default function NewBarRoute() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  if (loaderData.step === "pick" && !actionData) {
    return (
      <Page backAction={{ content: "Announcement bars", url: "/app/bars" }}>
        <AnnouncementLocationPicker />
      </Page>
    );
  }

  const values =
    actionData?.step === "form"
      ? actionData.values
      : loaderData.step === "form"
        ? loaderData.values!
        : barToFormValues(createEmptyBarInput("global"));
  const errors = actionData?.errors ?? (loaderData.step === "form" ? loaderData.errors : {});

  return (
    <Page
      titleHidden
      backAction={{ content: "Choose type", url: "/app/bars/new" }}
    >
      <AnnouncementBarForm initialValues={values} errors={errors} />
    </Page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
