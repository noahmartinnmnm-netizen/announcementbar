import { Banner, List, Text } from "@shopify/polaris";
import type { BarFormErrors } from "../../types";

interface BarFormErrorBannerProps {
  errors: BarFormErrors;
}

export function BarFormErrorBanner({ errors }: BarFormErrorBannerProps) {
  const messages = Object.values(errors).filter(Boolean);

  if (messages.length === 0) {
    return null;
  }

  return (
    <Banner tone="critical" title="Fix these issues before saving">
      <List type="bullet">
        {messages.map((message) => (
          <List.Item key={message}>
            <Text as="span" variant="bodyMd">
              {message}
            </Text>
          </List.Item>
        ))}
      </List>
    </Banner>
  );
}
