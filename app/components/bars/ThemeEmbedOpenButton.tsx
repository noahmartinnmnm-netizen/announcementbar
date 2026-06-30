import { Button } from "@shopify/polaris";
import { openThemeEmbedActivationUrl } from "../../utils/theme-embed";

interface ThemeEmbedOpenButtonProps {
  children: string;
}

export function ThemeEmbedOpenButton({ children }: ThemeEmbedOpenButtonProps) {
  return (
    <Button
      variant="primary"
      onClick={() => {
        openThemeEmbedActivationUrl();
      }}
    >
      {children}
    </Button>
  );
}
