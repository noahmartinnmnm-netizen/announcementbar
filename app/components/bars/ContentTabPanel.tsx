import {
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  ChoiceList,
  Collapsible,
  Divider,
  FormLayout,
  Icon,
  InlineStack,
  RangeSlider,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
import { useState } from "react";
import type {
  AnnouncementMessage,
  AnnouncementType,
  BarFormErrors,
  BarFormValues,
  CtaType,
  RunningTextAlign,
  RotateNavPlacement,
  ScheduleEndMode,
  ScheduleStartMode,
} from "../../types";
import { DEFAULT_RUNNING_SPEED, MAX_RUNNING_SPEED } from "../../utils/bar";
import { ColorField } from "./ColorField";
import { CouponCodePreview } from "./CouponCodePreview";
import { IconUrlPreview } from "./IconUrlPreview";

interface ContentTabPanelProps {
  values: BarFormValues;
  errors: BarFormErrors;
  updateField: <K extends keyof BarFormValues>(
    key: K,
    value: BarFormValues[K],
  ) => void;
}

const CTA_OPTIONS = [
  { label: "Button", value: "button" },
  { label: "Text link", value: "link" },
  { label: "None", value: "none" },
];

const TYPE_OPTIONS: Array<{ id: AnnouncementType; label: string }> = [
  { id: "simple", label: "Simple" },
  { id: "running", label: "Running" },
  { id: "rotating", label: "Rotating" },
];

function CtaFields({
  values,
  errors,
  updateField,
  ctaText,
  ctaUrl,
  onCtaTextChange,
  onCtaUrlChange,
}: {
  values: BarFormValues;
  errors: BarFormErrors;
  updateField: ContentTabPanelProps["updateField"];
  ctaText: string;
  ctaUrl: string;
  onCtaTextChange: (value: string) => void;
  onCtaUrlChange: (value: string) => void;
}) {
  const handleColorChange = <K extends keyof BarFormValues>(
    key: K,
    value: BarFormValues[K],
  ) => {
    updateField(key, value);
  };

  if (values.ctaType === "none") {
    return null;
  }

  return (
    <BlockStack gap="300">
      <TextField
        label={values.ctaType === "link" ? "Link text" : "Button label"}
        value={ctaText}
        onChange={onCtaTextChange}
        error={errors.ctaText}
        autoComplete="off"
        placeholder={values.ctaType === "button" ? "Shop now!" : "Learn more"}
      />
      <TextField
        label="Destination URL"
        value={ctaUrl}
        onChange={onCtaUrlChange}
        error={errors.ctaUrl}
        autoComplete="off"
        helpText="https://… or a store path like /collections/sale"
      />
      {values.ctaType === "button" ? (
        <FormLayout.Group>
          <ColorField
            label="Button color"
            value={values.buttonColor}
            onChange={(value) => handleColorChange("buttonColor", value)}
            error={errors.buttonColor}
          />
          <ColorField
            label="Button text color"
            value={values.buttonTextColor}
            onChange={(value) => handleColorChange("buttonTextColor", value)}
            error={errors.buttonTextColor}
          />
        </FormLayout.Group>
      ) : null}
    </BlockStack>
  );
}

export function ContentTabPanel({ values, errors, updateField }: ContentTabPanelProps) {
  const hasSchedule =
    values.scheduleStartMode === "date" || values.scheduleEndMode === "date";
  const [scheduleOpen, setScheduleOpen] = useState(hasSchedule);

  const handleColorChange = <K extends keyof BarFormValues>(
    key: K,
    value: BarFormValues[K],
  ) => {
    updateField(key, value);
  };

  const updateMessageField = (
    index: number,
    field: keyof AnnouncementMessage,
    value: string,
  ) => {
    const next = [...values.messages];
    next[index] = { ...next[index], [field]: value };
    updateField("messages", next);
  };

  const addRotatingMessage = () => {
    updateField("messages", [
      ...values.messages,
      {
        message: "",
        couponCode: values.couponCode,
        ctaText: values.ctaText,
        ctaUrl: values.ctaUrl,
      },
    ]);
  };

  const removeRotatingMessage = (index: number) => {
    updateField(
      "messages",
      values.messages.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const handleTypeChange = (type: AnnouncementType) => {
    updateField("announcementType", type);
    if (type === "rotating" && values.messages.length < 2) {
      updateField("messages", [
        {
          message: values.message,
          couponCode: values.couponCode,
          ctaText: values.ctaText,
          ctaUrl: values.ctaUrl,
        },
        {
          message: "",
          couponCode: "",
          ctaText: values.ctaText,
          ctaUrl: values.ctaUrl,
        },
      ]);
    }
  };

  return (
    <BlockStack gap="400">
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd">
            Basics
          </Text>
          <FormLayout>
            <TextField
              label="Internal name"
              value={values.name}
              onChange={(value) => updateField("name", value)}
              error={errors.name}
              autoComplete="off"
              helpText="Only visible to you in the app."
            />
            <BlockStack gap="200">
              <Text as="p" variant="bodyMd">
                Display style
              </Text>
              <ButtonGroup variant="segmented" fullWidth>
                {TYPE_OPTIONS.map((option) => (
                  <Button
                    key={option.id}
                    pressed={values.announcementType === option.id}
                    onClick={() => handleTypeChange(option.id)}
                  >
                    {option.label}
                  </Button>
                ))}
              </ButtonGroup>
              <Text as="p" variant="bodySm" tone="subdued">
                {values.announcementType === "simple"
                  ? "Static message with optional subheading."
                  : values.announcementType === "running"
                    ? "Continuous scrolling ticker text."
                    : "Multiple messages that rotate automatically."}
              </Text>
            </BlockStack>
          </FormLayout>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd">
            Message & button
          </Text>

          {values.announcementType === "rotating" ? (
            <BlockStack gap="300">
              <Text as="p" variant="bodySm" tone="subdued">
                Each slide has its own message and button. Shared button colors apply to all
                slides.
              </Text>
              {values.messages.map((item: AnnouncementMessage, index) => (
                <Box
                  key={`message-${index}`}
                  padding="300"
                  background="bg-surface-secondary"
                  borderRadius="200"
                >
                  <BlockStack gap="300">
                    <InlineStack align="space-between" blockAlign="center">
                      <Text as="h3" variant="headingSm">
                        Slide {index + 1}
                      </Text>
                      {values.messages.length > 2 ? (
                        <Button
                          tone="critical"
                          variant="plain"
                          onClick={() => removeRotatingMessage(index)}
                        >
                          Remove
                        </Button>
                      ) : null}
                    </InlineStack>
                    <TextField
                      label="Message"
                      value={item.message}
                      onChange={(value) => updateMessageField(index, "message", value)}
                      autoComplete="off"
                      multiline={2}
                    />
                    <TextField
                      label="Coupon code"
                      value={item.couponCode ?? ""}
                      onChange={(value) => updateMessageField(index, "couponCode", value)}
                      autoComplete="off"
                      placeholder="Optional"
                    />
                    {values.ctaType !== "none" ? (
                      <FormLayout.Group>
                        <TextField
                          label={
                            values.ctaType === "link" ? "Link text" : "Button label"
                          }
                          value={item.ctaText ?? ""}
                          onChange={(value) => updateMessageField(index, "ctaText", value)}
                          autoComplete="off"
                          placeholder="Shop now!"
                        />
                        <TextField
                          label="URL"
                          value={item.ctaUrl ?? ""}
                          onChange={(value) => updateMessageField(index, "ctaUrl", value)}
                          autoComplete="off"
                        />
                      </FormLayout.Group>
                    ) : null}
                  </BlockStack>
                </Box>
              ))}
              <Button onClick={addRotatingMessage} fullWidth>
                Add slide
              </Button>
              <FormLayout.Group>
                <TextField
                  label="Rotate every (sec)"
                  type="number"
                  value={values.rotateInterval}
                  onChange={(value) => updateField("rotateInterval", value)}
                  error={errors.rotateInterval}
                  autoComplete="off"
                />
                <Select
                  label="Arrow placement"
                  options={[
                    { label: "Next to content", value: "content" },
                    { label: "Bar edges", value: "edges" },
                  ]}
                  value={values.rotateNavPlacement}
                  onChange={(value) =>
                    updateField("rotateNavPlacement", value as RotateNavPlacement)
                  }
                />
              </FormLayout.Group>
            </BlockStack>
          ) : (
            <FormLayout>
              <TextField
                label="Headline"
                value={values.message}
                onChange={(value) => updateField("message", value)}
                error={errors.message}
                autoComplete="off"
              />
              {values.announcementType === "simple" ? (
                <TextField
                  label="Subheading"
                  value={values.subheading}
                  onChange={(value) => updateField("subheading", value)}
                  error={errors.subheading}
                  autoComplete="off"
                />
              ) : (
                <>
                  <Select
                    label="Scroll direction"
                    options={[
                      { label: "From left", value: "left" },
                      { label: "From right", value: "right" },
                    ]}
                    value={values.runningTextAlign}
                    onChange={(value) =>
                      updateField("runningTextAlign", value as RunningTextAlign)
                    }
                  />
                  <RangeSlider
                    label="Scroll speed"
                    value={Number(values.runningSpeed) || DEFAULT_RUNNING_SPEED}
                    min={20}
                    max={MAX_RUNNING_SPEED}
                    step={10}
                    output
                    onChange={(value) => updateField("runningSpeed", String(value))}
                    error={errors.runningSpeed}
                    helpText="Move left for slower scrolling, right for faster."
                  />
                </>
              )}
              <TextField
                label="Coupon code"
                value={values.couponCode}
                onChange={(value) => updateField("couponCode", value)}
                error={errors.couponCode}
                autoComplete="off"
                placeholder="Optional — shoppers can copy from the bar"
              />
              {values.couponCode.trim() ? (
                <CouponCodePreview couponCode={values.couponCode} />
              ) : null}
            </FormLayout>
          )}

          {values.announcementType === "running" ||
          values.announcementType === "rotating" ? (
            <Checkbox
              label="Pause on hover"
              checked={values.pauseOnHover}
              onChange={(checked) => updateField("pauseOnHover", checked)}
              helpText={
                values.announcementType === "running"
                  ? "Stop scrolling while the visitor hovers over the bar."
                  : "Stop rotating slides while the visitor hovers over the bar."
              }
            />
          ) : null}

          <Divider />

          <BlockStack gap="300">
            <Text as="h3" variant="headingSm">
              Shop button
            </Text>
            <Select
              label="Action type"
              labelHidden
              options={CTA_OPTIONS}
              value={values.ctaType}
              onChange={(value) => updateField("ctaType", value as CtaType)}
            />
            {values.announcementType === "rotating" && values.ctaType !== "none" ? (
              <FormLayout.Group>
                <ColorField
                  label="Button color"
                  value={values.buttonColor}
                  onChange={(value) => handleColorChange("buttonColor", value)}
                  error={errors.buttonColor}
                />
                <ColorField
                  label="Button text color"
                  value={values.buttonTextColor}
                  onChange={(value) => handleColorChange("buttonTextColor", value)}
                  error={errors.buttonTextColor}
                />
              </FormLayout.Group>
            ) : null}
            {values.announcementType !== "rotating" ? (
              <CtaFields
                values={values}
                errors={errors}
                updateField={updateField}
                ctaText={values.ctaText}
                ctaUrl={values.ctaUrl}
                onCtaTextChange={(value) => updateField("ctaText", value)}
                onCtaUrlChange={(value) => updateField("ctaUrl", value)}
              />
            ) : null}
            <Checkbox
              label="Show close button"
              checked={values.dismissible}
              onChange={(checked) => updateField("dismissible", checked)}
              helpText="Let customers dismiss the bar."
            />
          </BlockStack>

          {values.announcementType !== "rotating" ? (
            <>
              <Divider />
              <BlockStack gap="300">
                <Text as="h3" variant="headingSm">
                  Icon
                </Text>
                <TextField
                  label="Icon image URL"
                  value={values.iconUrl}
                  onChange={(value) => updateField("iconUrl", value)}
                  autoComplete="off"
                  placeholder="https://cdn.shopify.com/…/icon.png"
                  helpText="Optional. Paste a CDN or Shopify Files link."
                />
                <IconUrlPreview iconUrl={values.iconUrl} />
              </BlockStack>
            </>
          ) : null}
        </BlockStack>
      </Card>

      <Card padding="0">
        <Box padding="400">
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              <Icon source={CalendarIcon} tone="subdued" />
              <BlockStack gap="050">
                <Text as="h2" variant="headingMd">
                  Schedule
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  {hasSchedule
                    ? "Custom start or end dates configured"
                    : "Show immediately, no end date"}
                </Text>
              </BlockStack>
            </InlineStack>
            <Button
              variant="plain"
              onClick={() => setScheduleOpen((open) => !open)}
              icon={scheduleOpen ? ChevronUpIcon : ChevronDownIcon}
              accessibilityLabel={scheduleOpen ? "Collapse schedule" : "Expand schedule"}
            />
          </InlineStack>
        </Box>
        <Collapsible open={scheduleOpen} id="schedule-settings">
          <Box padding="400" paddingBlockStart="0">
            <BlockStack gap="400">
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd" fontWeight="semibold">
                  Starts
                </Text>
                <ChoiceList
                  title="Starts"
                  titleHidden
                  choices={[
                    { label: "Right now", value: "now" },
                    { label: "Specific date", value: "date" },
                  ]}
                  selected={[values.scheduleStartMode]}
                  onChange={(selected) =>
                    updateField("scheduleStartMode", selected[0] as ScheduleStartMode)
                  }
                />
                {values.scheduleStartMode === "date" ? (
                  <TextField
                    label="Start date"
                    type="datetime-local"
                    value={values.startDate}
                    onChange={(value) => updateField("startDate", value)}
                    error={errors.startDate}
                    autoComplete="off"
                  />
                ) : null}
              </BlockStack>

              <BlockStack gap="200">
                <Text as="p" variant="bodyMd" fontWeight="semibold">
                  Ends
                </Text>
                <ChoiceList
                  title="Ends"
                  titleHidden
                  choices={[
                    { label: "Never", value: "never" },
                    { label: "Specific date", value: "date" },
                  ]}
                  selected={[values.scheduleEndMode]}
                  onChange={(selected) =>
                    updateField("scheduleEndMode", selected[0] as ScheduleEndMode)
                  }
                />
                {values.scheduleEndMode === "date" ? (
                  <TextField
                    label="End date"
                    type="datetime-local"
                    value={values.endDate}
                    onChange={(value) => updateField("endDate", value)}
                    error={errors.endDate}
                    autoComplete="off"
                  />
                ) : null}
              </BlockStack>
            </BlockStack>
          </Box>
        </Collapsible>
      </Card>
    </BlockStack>
  );
}
