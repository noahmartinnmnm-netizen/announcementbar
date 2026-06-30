import { GET_SHOP_SETTINGS, SET_SHOP_SETTINGS } from "../graphql";
import type { AdminGraphQLClient, AppSettings } from "../types";
import {
  SETTINGS_METAFIELD_KEY,
  SETTINGS_METAFIELD_NAMESPACE,
} from "../utils/constants";
import { DEFAULT_SETTINGS, parseSettings } from "../utils/settings";

export {
  SETTINGS_METAFIELD_KEY,
  SETTINGS_METAFIELD_NAMESPACE,
} from "../utils/constants";

interface ShopSettingsQueryResult {
  data?: {
    shop?: {
      id: string;
      settingsMetafield?: {
        id: string;
        jsonValue: unknown;
      } | null;
    };
  };
  errors?: Array<{ message: string }>;
}

interface MetafieldsSetResult {
  data?: {
    metafieldsSet?: {
      metafields?: Array<{ id: string; jsonValue: unknown }>;
      userErrors?: Array<{ field: string[]; message: string }>;
    } | null;
  };
  errors?: Array<{ message: string }>;
}

async function getShopId(admin: AdminGraphQLClient): Promise<string> {
  const response = await admin.graphql(GET_SHOP_SETTINGS);
  const json = (await response.json()) as ShopSettingsQueryResult;

  if (json.errors?.length) {
    throw new Error(
      `Unable to load shop settings: ${json.errors.map((error) => error.message).join(", ")}`,
    );
  }

  const shopId = json.data?.shop?.id;

  if (!shopId) {
    throw new Error("Unable to load shop id for settings metafield.");
  }

  return shopId;
}

export async function getSettings(
  admin: AdminGraphQLClient,
): Promise<AppSettings> {
  const response = await admin.graphql(GET_SHOP_SETTINGS);
  const json = (await response.json()) as ShopSettingsQueryResult;

  if (json.errors?.length) {
    throw new Error(
      `Unable to read settings metafield: ${json.errors.map((error) => error.message).join(", ")}`,
    );
  }

  const rawValue = json.data?.shop?.settingsMetafield?.jsonValue;

  return parseSettings(rawValue ?? DEFAULT_SETTINGS);
}

export async function saveSettings(
  admin: AdminGraphQLClient,
  settings: AppSettings,
): Promise<AppSettings> {
  const shopId = await getShopId(admin);
  const response = await admin.graphql(SET_SHOP_SETTINGS, {
    variables: {
      metafields: [
        {
          ownerId: shopId,
          namespace: SETTINGS_METAFIELD_NAMESPACE,
          key: SETTINGS_METAFIELD_KEY,
          type: "json",
          value: JSON.stringify(settings),
        },
      ],
    },
  });

  const json = (await response.json()) as MetafieldsSetResult;

  if (json.errors?.length) {
    throw new Error(
      `GraphQL error saving settings: ${json.errors.map((error) => error.message).join(", ")}`,
    );
  }

  const userErrors = json.data?.metafieldsSet?.userErrors ?? [];

  if (userErrors.length > 0) {
    const message = userErrors.map((error) => error.message).join(", ");
    throw new Error(`Failed to save settings: ${message}`);
  }

  const savedMetafield = json.data?.metafieldsSet?.metafields?.[0];

  if (!savedMetafield?.id) {
    throw new Error(
      `Settings were not saved to ${SETTINGS_METAFIELD_NAMESPACE}.${SETTINGS_METAFIELD_KEY}. Deploy the app metafield definition with "shopify app deploy" and try again.`,
    );
  }

  return parseSettings(savedMetafield.jsonValue ?? settings);
}

export async function updateSettings(
  admin: AdminGraphQLClient,
  updater: (current: AppSettings) => AppSettings,
): Promise<AppSettings> {
  const current = await getSettings(admin);
  const next = updater(current);
  return saveSettings(admin, next);
}
