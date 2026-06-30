import { Badge } from "@shopify/polaris";

interface BarPublishBadgeProps {
  enabled: boolean;
}

export function BarPublishBadge({ enabled }: BarPublishBadgeProps) {
  return (
    <Badge tone={enabled ? "success" : undefined}>
      {enabled ? "Published" : "Not published"}
    </Badge>
  );
}
