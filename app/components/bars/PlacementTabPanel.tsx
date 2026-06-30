import {
  BlockStack,
  Banner,
  Box,
  Card,
  Checkbox,
  ChoiceList,
  Divider,
  InlineGrid,
  InlineStack,
  Text,
} from "@shopify/polaris";
import type { BarFormValues, BarPosition, DeviceTargeting, PageTargeting } from "../../types";
import { getDisplayLocationLabel } from "../../utils/bar";

interface PlacementTabPanelProps {
  values: BarFormValues;
  updateField: <K extends keyof BarFormValues>(
    key: K,
    value: BarFormValues[K],
  ) => void;
}

const PAGE_OPTIONS: Array<{ key: keyof PageTargeting; label: string }> = [
  { key: "home", label: "Home" },
  { key: "product", label: "Products" },
  { key: "collection", label: "Collections" },
  { key: "cart", label: "Cart" },
  { key: "search", label: "Search" },
  { key: "blog", label: "Blog" },
];

export function PlacementTabPanel({ values, updateField }: PlacementTabPanelProps) {
  const isGlobal = values.displayLocation === "global";
  const isCartPage = values.displayLocation === "cart_page";

  const updateDevice = (key: keyof DeviceTargeting, checked: boolean) => {
    updateField("devices", { ...values.devices, [key]: checked });
  };

  const updatePage = (key: keyof PageTargeting, checked: boolean) => {
    if (key === "all") {
      updateField("pages", {
        all: checked,
        home: checked,
        product: checked,
        collection: checked,
        cart: checked,
        search: checked,
        blog: checked,
      });
      return;
    }

    const next = { ...values.pages, [key]: checked };
    next.all = PAGE_OPTIONS.every((option) => next[option.key]);
    updateField("pages", next);
  };

  return (
    <BlockStack gap="400">
      <Banner tone="info">
        <Text as="p" variant="bodyMd">
          Showing as{" "}
          <Text as="span" fontWeight="semibold">
            {getDisplayLocationLabel(values.displayLocation)}
          </Text>
        </Text>
      </Banner>

      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd">
            Where it appears
          </Text>

          {isGlobal ? (
            <>
              <ChoiceList
                title="Bar position"
                choices={[
                  { label: "Top of page", value: "top" },
                  { label: "Bottom of page", value: "bottom" },
                ]}
                selected={[values.position]}
                onChange={(selected) => updateField("position", selected[0] as BarPosition)}
              />
              <Checkbox
                label="Sticky while scrolling"
                checked={values.sticky}
                onChange={(checked) => updateField("sticky", checked)}
                helpText="Keep the bar visible as customers scroll."
              />
            </>
          ) : (
            <Text as="p" variant="bodyMd" tone="subdued">
              {isCartPage
                ? "This bar appears at the top of the cart page."
                : "This bar appears at the top of the cart drawer when opened."}
            </Text>
          )}

          <Divider />

          <BlockStack gap="200">
            <Text as="h3" variant="headingSm">
              Devices
            </Text>
            <InlineStack gap="400" wrap>
              <Checkbox
                label="Desktop"
                checked={values.devices.desktop}
                onChange={(checked) => updateDevice("desktop", checked)}
              />
              <Checkbox
                label="Tablet"
                checked={values.devices.tablet}
                onChange={(checked) => updateDevice("tablet", checked)}
              />
              <Checkbox
                label="Mobile"
                checked={values.devices.mobile}
                onChange={(checked) => updateDevice("mobile", checked)}
              />
            </InlineStack>
          </BlockStack>

          {isGlobal ? (
            <>
              <Divider />
              <BlockStack gap="200">
                <Text as="h3" variant="headingSm">
                  Pages
                </Text>
                <Checkbox
                  label="All pages"
                  checked={values.pages.all}
                  onChange={(checked) => updatePage("all", checked)}
                />
                <Box paddingInlineStart="400">
                  <InlineGrid columns={2} gap="200">
                    {PAGE_OPTIONS.map((option) => (
                      <Checkbox
                        key={option.key}
                        label={option.label}
                        checked={values.pages[option.key]}
                        onChange={(checked) => updatePage(option.key, checked)}
                        disabled={values.pages.all}
                      />
                    ))}
                  </InlineGrid>
                </Box>
              </BlockStack>
            </>
          ) : null}
        </BlockStack>
      </Card>
    </BlockStack>
  );
}
