import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { OnboardingWizard } from "../components/onboarding";
import {
  completeOnboarding,
  getOnboardingStatus,
  saveOnboardingProgress,
} from "../services/onboarding.service";
import { authenticate } from "../shopify.server";
import { readDisplayLocation } from "../utils/bar";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const [{ onboarding, hasBars }] = await Promise.all([
    getOnboardingStatus(admin),
  ]);

  return {
    onboarding,
    hasBars,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, redirect } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "progress") {
    await saveOnboardingProgress(admin, {
      embedConfirmed: formData.get("embedConfirmed") === "true",
      preferredLocation: readDisplayLocation(
        String(formData.get("preferredLocation") ?? ""),
      ),
    });

    return { ok: true };
  }

  if (intent === "skip") {
    await completeOnboarding(admin, { skipped: true });
    return redirect("/app");
  }

  if (intent === "complete") {
    await completeOnboarding(admin, {
      skipped: false,
      embedConfirmed: formData.get("embedConfirmed") === "true",
      preferredLocation: readDisplayLocation(
        String(formData.get("preferredLocation") ?? ""),
      ),
    });
    return redirect("/app");
  }

  return redirect("/app/onboarding");
};

export default function OnboardingRoute() {
  const { onboarding, hasBars } = useLoaderData<typeof loader>();

  return (
    <OnboardingWizard onboarding={onboarding} hasBars={hasBars} />
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
