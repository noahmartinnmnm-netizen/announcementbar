import { Badge } from "@shopify/polaris";

interface BarStatusBadgeProps {
  enabled: boolean;
}

export function BarStatusBadge({ enabled }: BarStatusBadgeProps) {
  return (
    <Badge tone={enabled ? "success" : undefined}>
      {enabled ? "Active" : "Disabled"}
    </Badge>
  );
}
