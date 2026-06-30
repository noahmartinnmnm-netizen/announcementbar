import { GET_SHOP_PLAN } from "../graphql";
import type { AdminGraphQLClient, ShopPlanInfo } from "../types";
import { toShopPlanInfo } from "../utils/plan";

interface ShopPlanQueryResult {
  data?: {
    shop?: {
      plan?: {
        displayName: string;
        partnerDevelopment: boolean;
        shopifyPlus: boolean;
      };
    };
  };
}

export async function getShopPlan(
  admin: AdminGraphQLClient,
): Promise<ShopPlanInfo> {
  const response = await admin.graphql(GET_SHOP_PLAN);
  const json = (await response.json()) as ShopPlanQueryResult;
  const plan = json.data?.shop?.plan;

  if (!plan) {
    throw new Error("Unable to load shop plan information.");
  }

  return toShopPlanInfo(plan);
}
