import { Box, Button, InlineStack, Text } from "@shopify/polaris";
import { useCallback, useState } from "react";

interface CouponCodePreviewProps {
  couponCode: string;
}

export function CouponCodePreview({ couponCode }: CouponCodePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — no-op
    }
  }, [couponCode]);

  if (!couponCode.trim()) {
    return null;
  }

  return (
    <div style={{ border: "1px dotted var(--p-color-border)", borderRadius: 8 }}>
      <Box padding="300" background="bg-surface-secondary" borderRadius="200">
        <InlineStack align="space-between" blockAlign="center" gap="300">
          <Text as="span" variant="bodyMd" fontWeight="semibold">
            {couponCode}
          </Text>
          <Button variant="plain" onClick={handleCopy}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </InlineStack>
      </Box>
    </div>
  );
}
