import {
  BlockStack,
  Box,
  Card,
  Divider,
  FormLayout,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";

import type { BarFormErrors, BarFormValues, DesignPresetId } from "../../types";
import {
  DESIGN_PRESETS,
  getDesignPreset,
  getDesignPresetOptions,
} from "../../utils/design-presets";

import { ColorField } from "./ColorField";

interface DesignTabPanelProps {
  values: BarFormValues;
  errors: BarFormErrors;
  updateField: <K extends keyof BarFormValues>(
    key: K,
    value: BarFormValues[K],
  ) => void;
  applyDesignPreset: (presetId: DesignPresetId) => void;
}

function PresetChip({
  preset,
  selected,
  onSelect,
}: {
  preset: (typeof DESIGN_PRESETS)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  const { backgroundColor, textColor, buttonColor, buttonTextColor } = preset.colors;

  return (
    <button
      type="button"
      onClick={onSelect}
      title={preset.label}
      aria-label={`${preset.label} theme`}
      aria-pressed={selected}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 4,
        padding: 6,
        borderRadius: 10,
        border: selected ? "2px solid #005bd3" : "1px solid #e3e3e3",
        background: "#fff",
        cursor: "pointer",
        minWidth: 0,
        flex: "1 1 0",
      }}
    >
      <span
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2,
          borderRadius: 6,
          overflow: "hidden",
          height: 20,
        }}
      >
        {[backgroundColor, textColor, buttonColor, buttonTextColor].map((color) => (
          <span
            key={`${preset.id}-${color}`}
            style={{ backgroundColor: color, minHeight: 20 }}
          />
        ))}
      </span>
      <Text as="span" variant="bodySm" fontWeight={selected ? "semibold" : "regular"} truncate>
        {preset.label}
      </Text>
    </button>
  );
}

export function DesignTabPanel({
  values,
  errors,
  updateField,
  applyDesignPreset,
}: DesignTabPanelProps) {
  const activePreset = getDesignPreset(values.designPreset);
  const isCustomized =
    values.designPreset !== "custom" &&
    (values.backgroundColor !== activePreset.colors.backgroundColor ||
      values.textColor !== activePreset.colors.textColor ||
      values.buttonColor !== activePreset.colors.buttonColor ||
      values.buttonTextColor !== activePreset.colors.buttonTextColor);

  const handleColorChange = <K extends keyof BarFormValues>(
    key: K,
    value: BarFormValues[K],
  ) => {
    updateField(key, value);
  };

  const themedPresets = DESIGN_PRESETS.filter((preset) => preset.id !== "custom");

  return (
    <BlockStack gap="400">
      <Card>
        <BlockStack gap="400">
          <BlockStack gap="100">
            <Text as="h2" variant="headingMd">
              Theme & colors
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Start with a template, then fine-tune any color below.
            </Text>
          </BlockStack>

          <Select
            label="Theme"
            options={getDesignPresetOptions()}
            value={values.designPreset}
            onChange={(value) => applyDesignPreset(value as DesignPresetId)}
          />

          <Box
            padding="200"
            background="bg-surface-secondary"
            borderRadius="200"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
                gap: 8,
              }}
            >
              {themedPresets.map((preset) => (
                <PresetChip
                  key={preset.id}
                  preset={preset}
                  selected={values.designPreset === preset.id}
                  onSelect={() => applyDesignPreset(preset.id)}
                />
              ))}
            </div>
          </Box>

          {isCustomized ? (
            <Text as="p" variant="bodySm" tone="caution">
              Colors customized from {activePreset.label}. Pick the theme again to reset.
            </Text>
          ) : values.designPreset !== "custom" ? (
            <Text as="p" variant="bodySm" tone="subdued">
              {activePreset.description}
            </Text>
          ) : null}

          <Divider />

          <FormLayout>
            <FormLayout.Group>
              <ColorField
                label="Background"
                value={values.backgroundColor}
                onChange={(value) => handleColorChange("backgroundColor", value)}
                error={errors.backgroundColor}
              />
              <ColorField
                label="Text"
                value={values.textColor}
                onChange={(value) => handleColorChange("textColor", value)}
                error={errors.textColor}
              />
            </FormLayout.Group>
            <FormLayout.Group>
              <ColorField
                label="Button"
                value={values.buttonColor}
                onChange={(value) => handleColorChange("buttonColor", value)}
                error={errors.buttonColor}
              />
              <ColorField
                label="Button text"
                value={values.buttonTextColor}
                onChange={(value) => handleColorChange("buttonTextColor", value)}
                error={errors.buttonTextColor}
              />
            </FormLayout.Group>
          </FormLayout>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="400">
          <BlockStack gap="100">
            <Text as="h2" variant="headingMd">
              Size & shape
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Adjust how the bar looks on your storefront.
            </Text>
          </BlockStack>

          <FormLayout>
            <FormLayout.Group>
              <TextField
                label="Font size (px)"
                type="number"
                value={values.fontSize}
                onChange={(value) => updateField("fontSize", value)}
                error={errors.fontSize}
                autoComplete="off"
              />
              <TextField
                label="Height (px)"
                type="number"
                value={values.height}
                onChange={(value) => updateField("height", value)}
                error={errors.height}
                autoComplete="off"
              />
            </FormLayout.Group>

            <FormLayout.Group>
              <TextField
                label="Padding (px)"
                type="number"
                value={values.padding}
                onChange={(value) => updateField("padding", value)}
                error={errors.padding}
                autoComplete="off"
              />
              <TextField
                label="Corner radius (px)"
                type="number"
                value={values.borderRadius}
                onChange={(value) => updateField("borderRadius", value)}
                error={errors.borderRadius}
                autoComplete="off"
              />
            </FormLayout.Group>
          </FormLayout>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="400">
          <BlockStack gap="100">
            <Text as="h2" variant="headingMd">
              Custom code
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Add your own CSS and HTML/JavaScript to extend this bar on the storefront.
              Target the bar with{" "}
              <Text as="span" variant="bodySm" fontWeight="semibold">
                .smart-announcement-bar
              </Text>{" "}
              or{" "}
              <Text as="span" variant="bodySm" fontWeight="semibold">
                .smart-announcement-bar[data-bar-id=&quot;…&quot;]
              </Text>
              .
            </Text>
          </BlockStack>

          <FormLayout>
            <TextField
              label="Custom CSS"
              value={values.customCss}
              onChange={(value) => updateField("customCss", value)}
              multiline={8}
              monospaced
              autoComplete="off"
              placeholder={`.smart-announcement-bar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.smart-announcement-bar__cta {
  text-transform: uppercase;
}`}
              helpText="Styles are injected on the storefront when this bar is visible."
            />
            <TextField
              label="Custom HTML & JavaScript"
              value={values.customHtmlJavascript}
              onChange={(value) => updateField("customHtmlJavascript", value)}
              multiline={8}
              monospaced
              autoComplete="off"
              placeholder={`<span class="my-badge">New</span>

<script>
  // bar = bar config, element = bar root element
  console.log('Announcement bar loaded', bar.name);
</script>`}
              helpText="Paste JavaScript directly — do not wrap in <script> tags. Scripts receive bar and element arguments. Check the browser console (F12) if nothing appears."
            />
          </FormLayout>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}
