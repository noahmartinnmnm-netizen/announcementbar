export const GET_SHOP_PLAN = `#graphql
  query GetShopPlan {
    shop {
      plan {
        displayName
        partnerDevelopment
        shopifyPlus
      }
    }
  }
`;
