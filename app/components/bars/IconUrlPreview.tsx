import { BlockStack, Box, InlineStack, Text } from "@shopify/polaris";

const EXAMPLE_ICON_URL =
  "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?v=1530129081";

interface IconUrlPreviewProps {
  iconUrl: string;
}

export function IconUrlPreview({ iconUrl }: IconUrlPreviewProps) {
  const trimmed = iconUrl.trim();
  const previewUrl = trimmed || EXAMPLE_ICON_URL;
  const showingExample = !trimmed;

  return (
    <Box padding="300" background="bg-surface-secondary" borderRadius="200">
      <BlockStack gap="200">
        <Text as="p" variant="bodySm" tone="subdued">
          {showingExample
            ? "Example icon (use any CDN or Shopify Files URL):"
            : "Preview at bar size:"}
        </Text>
        <InlineStack gap="300" blockAlign="center">
          <Box
            padding="200"
            background="bg-surface"
            borderRadius="100"
            borderWidth="025"
            borderColor="border"
          >
            <img
              src={previewUrl}
              alt=""
              style={{
                display: "block",
                width: 18,
                height: 18,
                objectFit: "contain",
              }}
              onError={(event) => {
                event.currentTarget.style.opacity = "0.35";
              }}
            />
          </Box>
          {showingExample ? (
            <Text as="span" variant="bodySm" tone="subdued">
              https://cdn.shopify.com/…/your-icon.png
            </Text>
          ) : (
            <Text as="span" variant="bodySm" tone="success">
              Looks good — shown beside your message
            </Text>
          )}
        </InlineStack>
        <Text as="p" variant="bodySm" tone="subdued">
          Square PNG or SVG works best. Upload to Shopify Files or any CDN — displays at 18×18
          px in the bar.
        </Text>
      </BlockStack>
    </Box>
  );
}
