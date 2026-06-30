import { AppProvider as PolarisAppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import type { ReactNode } from "react";
import { PolarisLink } from "./PolarisLink";

interface AppProviderWithPolarisProps {
  apiKey: string;
  children: ReactNode;
}

export function AppProviderWithPolaris({
  apiKey,
  children,
}: AppProviderWithPolarisProps) {
  return (
    <AppProvider embedded apiKey={apiKey}>
      <PolarisAppProvider i18n={enTranslations} linkComponent={PolarisLink}>
        {children}
      </PolarisAppProvider>
    </AppProvider>
  );
}
