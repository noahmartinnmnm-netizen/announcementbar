export const GET_SHOP_SETTINGS = `#graphql
  query GetShopSettings {
    shop {
      id
      settingsMetafield: metafield(
        namespace: "$app:smart_announcement"
        key: "settings"
      ) {
        id
        jsonValue
      }
    }
  }
`;

export const SET_SHOP_SETTINGS = `#graphql
  mutation SetShopSettings($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        namespace
        key
        jsonValue
      }
      userErrors {
        field
        message
      }
    }
  }
`;
