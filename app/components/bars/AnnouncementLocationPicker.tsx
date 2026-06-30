import {
  BlockStack,
  Box,
  Button,
  Card,
  InlineGrid,
  Text,
} from "@shopify/polaris";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router";
import type { BarDisplayLocation } from "../../types";

interface LocationOption {
  id: BarDisplayLocation;
  title: string;
  description: string;
}

const LOCATION_OPTIONS: LocationOption[] = [
  {
    id: "global",
    title: "Top/Bottom bar",
    description: "Fixed or sticky bar on the top or bottom of any page.",
  },
  {
    id: "cart_page",
    title: "Cart page",
    description: "Add an announcement bar to the top of the cart page.",
  },
  {
    id: "cart_drawer",
    title: "Cart drawer",
    description: "Show an announcement bar at the top of the cart drawer.",
  },
];

function LocationIllustration({ location }: { location: BarDisplayLocation }) {
  const barStyle: CSSProperties = {
    height: 10,
    background: "#111827",
    borderRadius: 2,
    marginBottom: 8,
  };

  if (location === "cart_page") {
    return (
      <Box padding="400" background="bg-surface-secondary" borderRadius="200">
        <div style={barStyle} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 0",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              background: "#e5e7eb",
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: 10,
                width: "70%",
                background: "#f3f4f6",
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                height: 8,
                width: "40%",
                background: "#f3f4f6",
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      </Box>
    );
  }

  if (location === "cart_drawer") {
    return (
      <Box padding="400" background="bg-surface-secondary" borderRadius="200">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              width: "55%",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 12,
              minHeight: 120,
            }}
          >
            <div style={barStyle} />
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#e5e7eb",
                margin: "12px auto",
              }}
            />
            <div
              style={{
                height: 8,
                background: "#f3f4f6",
                borderRadius: 4,
                marginBottom: 6,
              }}
            />
            <div
              style={{
                height: 8,
                width: "70%",
                background: "#f3f4f6",
                borderRadius: 4,
                margin: "0 auto",
              }}
            />
          </div>
        </div>
      </Box>
    );
  }

  return (
    <Box padding="400" background="bg-surface-secondary" borderRadius="200">
      <div style={barStyle} />
      <div
        style={{
          height: 8,
          width: "30%",
          background: "#e5e7eb",
          borderRadius: 4,
          marginBottom: 16,
        }}
      />
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            style={{
              height: 6,
              width: 48,
              background: "#f3f4f6",
              borderRadius: 4,
            }}
          />
        ))}
      </div>
      <div
        style={{
          height: 64,
          background: "#f9fafb",
          borderRadius: 8,
          border: "1px solid #f3f4f6",
        }}
      />
    </Box>
  );
}

export function AnnouncementLocationPicker() {
  const navigate = useNavigate();

  return (
    <BlockStack gap="500">
      <Text as="h1" variant="headingLg">
        Choose announcement type
      </Text>
      <InlineGrid columns={{ xs: 1, md: 3 }} gap="400">
        {LOCATION_OPTIONS.map((option) => (
          <Card key={option.id}>
            <BlockStack gap="400">
              <LocationIllustration location={option.id} />
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  {option.title}
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  {option.description}
                </Text>
              </BlockStack>
              <Button
                fullWidth
                onClick={() => navigate(`/app/bars/new?location=${option.id}`)}
              >
                Select this announcement type
              </Button>
            </BlockStack>
          </Card>
        ))}
      </InlineGrid>
    </BlockStack>
  );
}
