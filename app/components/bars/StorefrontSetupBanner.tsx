import { Banner, BlockStack, Text } from "@shopify/polaris";
import { ThemeEmbedOpenButton } from "./ThemeEmbedOpenButton";

interface StorefrontSetupBannerProps {
  published: boolean;
}

export function StorefrontSetupBanner({
  published,
}: StorefrontSetupBannerProps) {
  if (!published) {
    return null;
  }

  return (
    <Banner tone="success" title="Your announcement bar is ready">
      <BlockStack gap="300">
        <Text as="p" variant="bodyMd">
          You have published your bar. Click the button below to open the theme
          editor, enable the app embed, and preview it on your storefront.
        </Text>
        <ThemeEmbedOpenButton>Preview on storefront</ThemeEmbedOpenButton>
      </BlockStack>
    </Banner>
  );
}
