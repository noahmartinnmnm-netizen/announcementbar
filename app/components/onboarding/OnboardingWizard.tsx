import {
  BlockStack,
  Box,
  Button,
  Checkbox,
  InlineGrid,
  InlineStack,
  List,
  Text,
} from "@shopify/polaris";
import {
  CartIcon,
  CheckCircleIcon,
  CursorIcon,
  NotificationIcon,
  ThemeEditIcon,
} from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import { Form, useFetcher } from "react-router";
import type { BarDisplayLocation, OnboardingState } from "../../types";
import { getDisplayLocationLabel } from "../../utils/bar";
import { ThemeEmbedOpenButton } from "../bars/ThemeEmbedOpenButton";
import {
  ONBOARDING_STEPS,
  type OnboardingStepId,
} from "../../utils/onboarding";
interface OnboardingWizardProps {
  onboarding: OnboardingState;
  hasBars: boolean;
}

const PLACEMENT_OPTIONS: Array<{
  id: BarDisplayLocation;
  title: string;
  description: string;
}> = [
  {
    id: "global",
    title: "Top / bottom bar",
    description: "Sticky or static banner across your storefront pages.",
  },
  {
    id: "cart_page",
    title: "Cart page",
    description: "Promote offers at the top of the full cart page.",
  },
  {
    id: "cart_drawer",
    title: "Cart drawer",
    description: "Catch shoppers with a message inside the slide-out cart.",
  },
];

function getInitialStep(
  onboarding: OnboardingState,
  hasBars: boolean,
): OnboardingStepId {
  if (hasBars) {
    return "done";
  }

  if (onboarding.preferredLocation) {
    return "create";
  }

  if (onboarding.embedConfirmed) {
    return "placement";
  }

  return "welcome";
}

export function OnboardingWizard({
  onboarding,
  hasBars,
}: OnboardingWizardProps) {
  const fetcher = useFetcher();
  const [stepIndex, setStepIndex] = useState(() => {
    const initialStep = getInitialStep(onboarding, hasBars);
    return ONBOARDING_STEPS.findIndex((step) => step.id === initialStep);
  });
  const [embedConfirmed, setEmbedConfirmed] = useState(onboarding.embedConfirmed);
  const [preferredLocation, setPreferredLocation] = useState<BarDisplayLocation>(
    onboarding.preferredLocation ?? "global",
  );

  const currentStep = ONBOARDING_STEPS[stepIndex] ?? ONBOARDING_STEPS[0];
  const isSaving = fetcher.state !== "idle";

  const persistProgress = useCallback(
    (patch: {
      embedConfirmed?: boolean;
      preferredLocation?: BarDisplayLocation;
    }) => {
      fetcher.submit(
        {
          intent: "progress",
          embedConfirmed: String(patch.embedConfirmed ?? embedConfirmed),
          preferredLocation: patch.preferredLocation ?? preferredLocation,
        },
        { method: "post" },
      );
    },
    [embedConfirmed, fetcher, preferredLocation],
  );

  useEffect(() => {
    if (hasBars && stepIndex < ONBOARDING_STEPS.length - 1) {
      setStepIndex(ONBOARDING_STEPS.length - 1);
    }
  }, [hasBars, stepIndex]);

  const goNext = () => {
    if (currentStep.id === "embed") {
      persistProgress({ embedConfirmed });
    }

    if (currentStep.id === "placement") {
      persistProgress({ preferredLocation });
    }

    setStepIndex((current) => Math.min(current + 1, ONBOARDING_STEPS.length - 1));
  };

  const goBack = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const createBarUrl = `/app/bars/new?location=${preferredLocation}`;

  return (
    <div className="sab-onboarding">
      <div className="sab-onboarding__shell">
        <aside className="sab-onboarding__sidebar">
          <span className="sab-onboarding__brand">
            <NotificationIcon />
            Setup guide
          </span>
          <Text as="h1" variant="headingLg">
            Get your first announcement live
          </Text>
          <Text as="p" variant="bodyMd" tone="subdued">
            Follow these quick steps to connect your theme and launch a bar on
            your storefront.
          </Text>

          <ol className="sab-onboarding__steps">
            {ONBOARDING_STEPS.map((step, index) => {
              const isActive = index === stepIndex;
              const isComplete = index < stepIndex || (hasBars && step.id === "create");

              return (
                <li
                  key={step.id}
                  className={[
                    "sab-onboarding__step",
                    isActive ? "sab-onboarding__step--active" : "",
                    isComplete ? "sab-onboarding__step--complete" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="sab-onboarding__step-index">
                    {isComplete ? "✓" : index + 1}
                  </span>
                  <span>
                    <span className="sab-onboarding__step-title">{step.title}</span>
                    <span className="sab-onboarding__step-copy">{step.description}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </aside>

        <section className="sab-onboarding__panel">
          <div className="sab-onboarding__progress">
            <span>
              Step {stepIndex + 1} of {ONBOARDING_STEPS.length}
            </span>
            <div className="sab-onboarding__progress-bar">
              <div
                className="sab-onboarding__progress-fill"
                style={{
                  width: `${((stepIndex + 1) / ONBOARDING_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {currentStep.id === "welcome" ? (
            <WelcomeStep />
          ) : null}

          {currentStep.id === "embed" ? (
            <EmbedStep
              embedConfirmed={embedConfirmed}
              onEmbedConfirmedChange={setEmbedConfirmed}
            />
          ) : null}

          {currentStep.id === "placement" ? (
            <PlacementStep
              preferredLocation={preferredLocation}
              onSelect={setPreferredLocation}
            />
          ) : null}

          {currentStep.id === "create" ? (
            <CreateStep
              preferredLocation={preferredLocation}
              createBarUrl={createBarUrl}
              hasBars={hasBars}
            />
          ) : null}

          {currentStep.id === "done" ? (
            <DoneStep preferredLocation={preferredLocation} hasBars={hasBars} />
          ) : null}

          <div className="sab-onboarding__actions">
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200">
                {stepIndex > 0 && currentStep.id !== "done" ? (
                  <Button onClick={goBack} disabled={isSaving}>
                    Back
                  </Button>
                ) : null}
                <Form method="post">
                  <input type="hidden" name="intent" value="skip" />
                  <Button submit variant="plain" disabled={isSaving}>
                    Skip setup
                  </Button>
                </Form>
              </InlineStack>

              <InlineStack gap="200">
                {currentStep.id === "create" ? (
                  <>
                    <Button url={createBarUrl} variant="primary">
                      Create announcement bar
                    </Button>
                    <Form method="post">
                      <input type="hidden" name="intent" value="complete" />
                      <input
                        type="hidden"
                        name="preferredLocation"
                        value={preferredLocation}
                      />
                      <input
                        type="hidden"
                        name="embedConfirmed"
                        value={String(embedConfirmed)}
                      />
                      <Button submit disabled={isSaving}>
                        Continue without creating
                      </Button>
                    </Form>
                  </>
                ) : null}

                {currentStep.id === "done" ? (
                  <Form method="post">
                    <input type="hidden" name="intent" value="complete" />
                    <input
                      type="hidden"
                      name="preferredLocation"
                      value={preferredLocation}
                    />
                    <input
                      type="hidden"
                      name="embedConfirmed"
                      value={String(embedConfirmed)}
                    />
                    <Button submit variant="primary" disabled={isSaving}>
                      Go to dashboard
                    </Button>
                  </Form>
                ) : null}

                {currentStep.id !== "create" && currentStep.id !== "done" ? (
                  <Button
                    variant="primary"
                    onClick={goNext}
                    disabled={
                      isSaving ||
                      (currentStep.id === "embed" && !embedConfirmed)
                    }
                  >
                    Continue
                  </Button>
                ) : null}
              </InlineStack>
            </InlineStack>
          </div>
        </section>
      </div>
    </div>
  );
}

function WelcomeStep() {
  return (
    <BlockStack gap="500">
      <div className="sab-onboarding__hero-card">
        <span className="sab-onboarding__hero-icon">
          <NotificationIcon />
        </span>
        <Text as="h2" variant="headingLg">
          Welcome to Smart Announcement Bar
        </Text>
        <Text as="p" variant="bodyMd" tone="subdued">
          Promote sales, shipping updates, coupon codes, and urgency messages
          without editing theme code.
        </Text>
      </div>

      <InlineGrid columns={{ xs: 1, sm: 3 }} gap="300">
        <FeatureCard
          icon={CursorIcon}
          title="Flexible placements"
          body="Show bars globally, on the cart page, or inside the cart drawer."
        />
        <FeatureCard
          icon={ThemeEditIcon}
          title="Theme-safe setup"
          body="Enable one app embed and manage everything from this admin."
        />
        <FeatureCard
          icon={CartIcon}
          title="Built for conversion"
          body="Use rotating messages, coupons, and CTAs to lift AOV."
        />
      </InlineGrid>
    </BlockStack>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof CursorIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="sab-onboarding__feature-card">
      <span className="sab-onboarding__feature-icon">
        <Icon />
      </span>
      <Text as="h3" variant="headingSm">
        {title}
      </Text>
      <Text as="p" variant="bodySm" tone="subdued">
        {body}
      </Text>
    </div>
  );
}

function EmbedStep({
  embedConfirmed,
  onEmbedConfirmedChange,
}: {
  embedConfirmed: boolean;
  onEmbedConfirmedChange: (checked: boolean) => void;
}) {
  return (
    <BlockStack gap="400">
      <BlockStack gap="200">
        <Text as="h2" variant="headingMd">
          Enable the theme app embed
        </Text>
        <Text as="p" variant="bodyMd" tone="subdued">
          Your announcement bars are saved to shop metafields, but shoppers only
          see them after the embed is activated in your theme.
        </Text>
      </BlockStack>

      <Box padding="400" background="bg-surface-secondary" borderRadius="300">
        <List type="number">
          <List.Item>Open your theme editor using the button below.</List.Item>
          <List.Item>
            Under App embeds, enable{" "}
            <Text as="span" fontWeight="semibold">
              Smart Announcement Bar
            </Text>
            .
          </List.Item>
        </List>
      </Box>

      <InlineStack gap="300" wrap>
        <ThemeEmbedOpenButton>Open theme editor</ThemeEmbedOpenButton>
        <Checkbox
          label="I've enabled the Smart Announcement Bar app embed"
          checked={embedConfirmed}
          onChange={onEmbedConfirmedChange}
        />
      </InlineStack>
    </BlockStack>
  );
}

function PlacementStep({
  preferredLocation,
  onSelect,
}: {
  preferredLocation: BarDisplayLocation;
  onSelect: (location: BarDisplayLocation) => void;
}) {
  return (
    <BlockStack gap="400">
      <BlockStack gap="200">
        <Text as="h2" variant="headingMd">
          Where should your first bar appear?
        </Text>
        <Text as="p" variant="bodyMd" tone="subdued">
          You can create more bars later with different placements. Pick a
          starting point for now.
        </Text>
      </BlockStack>

      <InlineGrid columns={{ xs: 1, sm: 3 }} gap="300">
        {PLACEMENT_OPTIONS.map((option) => {
          const selected = preferredLocation === option.id;

          return (
            <button
              key={option.id}
              type="button"
              className={[
                "sab-onboarding__placement-card",
                selected ? "sab-onboarding__placement-card--selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onSelect(option.id)}
            >
              <Text as="h3" variant="headingSm">
                {option.title}
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                {option.description}
              </Text>
            </button>
          );
        })}
      </InlineGrid>
    </BlockStack>
  );
}

function CreateStep({
  preferredLocation,
  createBarUrl,
  hasBars,
}: {
  preferredLocation: BarDisplayLocation;
  createBarUrl: string;
  hasBars: boolean;
}) {
  return (
    <BlockStack gap="400">
      <BlockStack gap="200">
        <Text as="h2" variant="headingMd">
          Create your first announcement bar
        </Text>
        <Text as="p" variant="bodyMd" tone="subdued">
          We&apos;ll open the editor with{" "}
          <Text as="span" fontWeight="semibold">
            {getDisplayLocationLabel(preferredLocation)}
          </Text>{" "}
          pre-selected. Add your message, customize design, and publish.
        </Text>
      </BlockStack>

      <div className="sab-onboarding__create-card">
        {hasBars ? (
          <InlineStack gap="200" blockAlign="center">
            <span className="sab-onboarding__success-icon">
              <CheckCircleIcon />
            </span>
            <Text as="p" variant="bodyMd">
              Great — you already created an announcement bar. Continue to finish
              setup.
            </Text>
          </InlineStack>
        ) : (
          <>
            <Text as="p" variant="bodyMd">
              Ready to build? Jump into the bar editor and publish when you&apos;re
              happy with the preview.
            </Text>
            <Box paddingBlockStart="300">
              <Button url={createBarUrl} variant="primary">
                Open bar editor
              </Button>
            </Box>
          </>
        )}
      </div>
    </BlockStack>
  );
}

function DoneStep({
  preferredLocation,
  hasBars,
}: {
  preferredLocation: BarDisplayLocation;
  hasBars: boolean;
}) {
  return (
    <BlockStack gap="400">
      <div className="sab-onboarding__done-card">
        <span className="sab-onboarding__done-icon">
          <CheckCircleIcon />
        </span>
        <Text as="h2" variant="headingLg">
          You&apos;re ready to go
        </Text>
        <Text as="p" variant="bodyMd" tone="subdued">
          {hasBars
            ? "Your announcement bar is saved. Visit your storefront to confirm it looks right on desktop and mobile."
            : "Setup is complete. Create bars anytime from the dashboard or announcement bars page."}
        </Text>
      </div>

      <InlineGrid columns={{ xs: 1, sm: 2 }} gap="300">
        <div className="sab-onboarding__summary-card">
          <Text as="h3" variant="headingSm">
            Preferred placement
          </Text>
          <Text as="p" variant="bodyMd">
            {getDisplayLocationLabel(preferredLocation)}
          </Text>
        </div>
        <div className="sab-onboarding__summary-card">
          <Text as="h3" variant="headingSm">
            Next steps
          </Text>
          <Text as="p" variant="bodyMd">
            {hasBars
              ? "Monitor performance and duplicate winning campaigns."
              : "Create your first bar and enable the theme embed if you haven't yet."}
          </Text>
        </div>
      </InlineGrid>
    </BlockStack>
  );
}
